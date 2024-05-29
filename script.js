document.getElementById("qrForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form from submitting normally

  const letter = document.getElementById("letter").value.trim().toUpperCase();
  const startNumber = parseInt(
    document.getElementById("startNumber").value,
    10
  );
  const endNumber = parseInt(document.getElementById("endNumber").value, 10);

  if (
    letter &&
    !isNaN(startNumber) &&
    !isNaN(endNumber) &&
    startNumber <= endNumber
  ) {
    generateAndDownloadQRCodesInBatches(letter, startNumber, endNumber);
  } else {
    alert("Please enter valid input values.");
  }
});

async function generateAndDownloadQRCodesInBatches(
  letter,
  startNumber,
  endNumber
) {
  const options = {
    width: 256,
    margin: 2,
  };

  const codes = [];
  for (let i = startNumber; i <= endNumber; i++) {
    codes.push(`${letter}${i}`);
  }

  const batchSize = 10;
  for (let i = 0; i < codes.length; i += batchSize) {
    const batch = codes.slice(i, i + batchSize);
    await downloadBatch(batch, options, letter);
  }
}

function downloadBatch(batch, options, letter) {
  return new Promise((resolve) => {
    let completedDownloads = 0;
    batch.forEach((data) => {
      QRCode.toDataURL(data, options, function (err, url) {
        if (err) throw err;

        const link = document.createElement("a");
        link.href = url;
        link.download = `${letter}/qrcode-${data}.png`; // Using the letter as the folder name

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        completedDownloads++;
        if (completedDownloads === batch.length) {
          resolve();
        }
      });
    });
  });
}
