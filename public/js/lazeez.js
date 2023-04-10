function submitOrder(event) {
  event.preventDefault();
  const formData = {};
  formData.name = event.target.name.value;
  formData.phone = event.target.phone.value;
  formData.item = event.target.item.value;

  fetch("/submit-form", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
      alert("Order submitted successfully!");
      window.location.assign("/orders");
    })
    .catch((error) => {
      console.error(error);
    });
}

// form.addEventListener("submit", (event) => {
//   event.preventDefault();

//   console.log("hello mizan");

//   const formData = new FormData(form);

//   fetch("/submit-form", {
//     method: "POST",
//     body: formData,
//   })
//     .then((response) => response.text())
//     .then((data) => {
//       console.log(data);
//       alert("Order submitted successfully!");
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// });

// const submitButton = document.querySelector(".submit-button");
// const form = document.querySelector("#form");
// const nameInput = document.querySelector("#name");
// const phoneInput = document.querySelector("#phone");
// const itemInput = document.querySelector("#item");

// submitButton.addEventListener("click", () => {
//   console.log(`Name: ${nameInput.value}`);
//   console.log(`Phone: ${phoneInput.value}`);
//   console.log(`Item: ${itemInput.value}`);
//   // window.location.href = "/";
// });
