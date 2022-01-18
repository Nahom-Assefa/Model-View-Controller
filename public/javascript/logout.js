async function logout(event) {
  event.preventDefault();

  const response = await fetch("/api/developers/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    document.location.replace("/");
    alert("You are now logged out");
  } else {
    alert(response.statusText);
  }
}

document.querySelector('#logout').addEventListener("click", logout);