User;
function viewMemeDetails(memeId) {
  event.preventDefault();

  console.log("Sending POST request to /meme-details/details with ID:", memeId); // Updated log message

  fetch("/meme-details/details", {
    // Updated URL to match the new route
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: memeId }),
  })
    .then((response) => {
      if (response.ok) {
        // Mark the meme as viewed and change the row color to grey
        markMemeAsViewed(memeId);
        return response.text();
      } else {
        throw new Error("Could not fetch meme details");
      }
    })
    .then((html) => {
      // Open the meme details in a new window
      const newWindow = window.open("", "_blank");
      newWindow.document.write(html);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function markMemeAsViewed(id) {
  const storedData = JSON.parse(
    localStorage.getItem("viewedMemesSession") || "{}"
  );
  const viewedMemes = new Set(storedData.viewedMemes || []);
  viewedMemes.add(id);
  console.log("Marked meme as viewed with ID:", id);

  const newData = {
    sessionId: currentServerSessionId,
    viewedMemes: [...viewedMemes],
  };

  localStorage.setItem("viewedMemesSession", JSON.stringify(newData));

  const row = document.getElementById(`meme-row-${id}`);
  if (row) {
    row.style.backgroundColor = "lightgray";
    console.log("Updated row color for viewed meme with ID:", id);
  }
}
