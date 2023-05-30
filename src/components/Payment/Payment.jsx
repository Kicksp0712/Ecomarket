import { useEffect } from "react";

const FORM_ID = "payment-form";

export function Payment({ preferenceId }) {
  useEffect(() => {
    if (preferenceId) {
      // con el preferenceId en mano, inyectamos el script de mercadoPago
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "https://www.mercadopago.com.mx/integrations/v1/web-payment-checkout.js";
      script.setAttribute("data-preference-id", preferenceId);
      const form = document.getElementById(FORM_ID);
      form.appendChild(script);
    }
  },[preferenceId]);

  return <form id={FORM_ID} method="GET" />;
}
