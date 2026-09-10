const SUPABASE_URL = "https://asmfzjvdtzwdshtqwqpm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_yMeZWVlo54JNvou0fVIRiQ_H_fjjDz6";

const chooseButtons = document.querySelectorAll(".choose-plan");
const orderForm = document.getElementById("orderForm");
const successModal = document.getElementById("successModal");
const closeModal = document.getElementById("closeModal");
const year = document.getElementById("year");
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const submitBtn = document.getElementById("submitBtn");

year.textContent = new Date().getFullYear();

function selectPlan(value) {
  const radio = [...document.querySelectorAll('input[name="plano"]')]
    .find((item) => item.value === value);

  if (radio) {
    radio.checked = true;
  }
}

chooseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectPlan(button.dataset.plan);
    document.getElementById("pedido").scrollIntoView({ behavior: "smooth" });
  });
});

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
  menuBtn.setAttribute(
    "aria-expanded",
    mobileMenu.classList.contains("open") ? "true" : "false"
  );
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

function setSubmitting(isSubmitting) {
  submitBtn.disabled = isSubmitting;
  const label = submitBtn.querySelector(".submit-label");
  label.textContent = isSubmitting ? "Enviando..." : "Enviar pedido";
}

function showFormError(message) {
  let box = orderForm.querySelector(".form-feedback");

  if (!box) {
    box = document.createElement("div");
    box.className = "form-feedback error";
    submitBtn.insertAdjacentElement("beforebegin", box);
  }

  box.textContent = message;
  box.classList.add("show");
}

function clearFormError() {
  const box = orderForm.querySelector(".form-feedback");
  if (box) box.classList.remove("show");
}

orderForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearFormError();

  const formData = new FormData(orderForm);

  // Campo invisível contra bots simples.
  if (formData.get("website")) {
    return;
  }

  const plano = formData.get("plano");
  if (!plano) {
    showFormError("Escolha um plano antes de enviar.");
    return;
  }

  const pedido = {
    nome: String(formData.get("nome") || "").trim(),
    empresa: String(formData.get("empresa") || "").trim(),
    whatsapp: String(formData.get("whatsapp") || "").trim(),
    instagram: String(formData.get("instagram") || "").trim(),
    plano: String(plano),
    descricao: String(formData.get("descricao") || "").trim()
  };

  if (pedido.nome.length < 2) {
    showFormError("Digite um nome válido.");
    return;
  }

  const digits = pedido.whatsapp.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13) {
    showFormError("Digite um WhatsApp válido com DDD.");
    return;
  }

  if (pedido.descricao.length < 10) {
    showFormError("Conte um pouco mais sobre o projeto.");
    return;
  }

  const lastSubmit = Number(localStorage.getItem("norte_last_submit") || 0);
  if (Date.now() - lastSubmit < 15000) {
    showFormError("Aguarde alguns segundos antes de enviar outro pedido.");
    return;
  }

  setSubmitting(true);

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/pedidos`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_PUBLISHABLE_KEY,
        "Authorization": `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(pedido)
    });

    if (!response.ok) {
      let details = "";
      try {
        const data = await response.json();
        details = data?.message || data?.hint || "";
      } catch (_) {}

      throw new Error(details || `Erro ${response.status}`);
    }

    localStorage.setItem("norte_last_submit", String(Date.now()));
    orderForm.reset();
    successModal.classList.add("show");
    successModal.setAttribute("aria-hidden", "false");
  } catch (error) {
    console.error("Erro ao enviar pedido:", error);
    showFormError(
      "Não consegui enviar o pedido agora. Confira sua conexão e tente novamente."
    );
  } finally {
    setSubmitting(false);
  }
});

function closeSuccessModal() {
  successModal.classList.remove("show");
  successModal.setAttribute("aria-hidden", "true");
}

closeModal.addEventListener("click", closeSuccessModal);

successModal.addEventListener("click", (event) => {
  if (event.target === successModal) closeSuccessModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeSuccessModal();
});
