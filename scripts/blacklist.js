let originalTextMap = new Map();

function addHeaderAndElement() {
  let generalContent = document.querySelector(".general-content");

  // Add a header only if it doesn't exist
  if (!generalContent.querySelector(".header")) {
    let header = document.createElement("div");
    header.className = "header";
    header.textContent = "Word Replacement";
    generalContent.appendChild(header);
  }

  // Add an element only if it doesn't exist
  if (!generalContent.querySelector(".element")) {
    let elementContainer = document.createElement("div");
    elementContainer.className = "element";

    let label = document.createElement("label");
    label.setAttribute("for", "wordInput");
    label.textContent = "Enter word to hide: ";

    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "wordInput");
    input.addEventListener("input", replaceWords);

    elementContainer.appendChild(label);
    elementContainer.appendChild(input);

    generalContent.appendChild(elementContainer);
  }
}

function replaceWords() {
  let inputValue = document.getElementById("wordInput").value.toLowerCase();

  document.querySelectorAll("*").forEach(function (element) {
    restoreOriginalText(element);

    if (element.nodeType === 3) {
      // Text node
      processTextNode(element, inputValue);
    } else if (element.hasChildNodes()) {
      replaceWordsInElement(element, inputValue);
    }
  });
}

function restoreOriginalText(element) {
  if (originalTextMap.has(element)) {
    element.textContent = originalTextMap.get(element);
    originalTextMap.delete(element);
  }
}

function processTextNode(textNode, inputValue) {
  let originalText = textNode.nodeValue;
  originalTextMap.set(textNode, originalText);

  textNode.nodeValue = originalText.replace(
    new RegExp("\\b" + inputValue + "\\b", "gi"),
    "*".repeat(inputValue.length)
  );
}

function replaceWordsInElement(element, inputValue) {
  element.childNodes.forEach(function (child) {
    restoreOriginalText(child);

    if (child.nodeType === 3) {
      // Text node
      processTextNode(child, inputValue);
    } else if (child.hasChildNodes()) {
      replaceWordsInElement(child, inputValue);
    }
  });
}

// Check if the content is already added (guard clause)
if (!document.querySelector(".element")) {
  // Call the function to add content
  addHeaderAndElement();
}
