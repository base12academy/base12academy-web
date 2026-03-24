"use client";

export default function ComprarPage() {
  const handlePago = async () => {
    const res = await fetch("/api/redsys", {
      method: "POST",
    });

    const data = await res.json();

    const form = document.createElement("form");
    form.method = "POST";
    form.action = data.redsysUrl;

    const version = document.createElement("input");
version.type = "hidden";
version.name = "Ds_SignatureVersion";
version.value = data.dsSignatureVersion;
form.appendChild(version);

    const params = document.createElement("input");
params.type = "hidden";
params.name = "Ds_MerchantParameters";
params.value = data.dsMerchantParameters;
form.appendChild(params);

    // ⚠️ firma (la añadiremos en el siguiente paso)
    const signature = document.createElement("input");
signature.type = "hidden";
signature.name = "Ds_Signature";
signature.value = data.signature;
form.appendChild(signature);

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div style={{ padding: "32px" }}>
      <h1>Comprar curso</h1>

      <button onClick={handlePago}>
        Pagar con tarjeta
      </button>
    </div>
  );
}
