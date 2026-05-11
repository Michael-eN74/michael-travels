document.addEventListener("DOMContentLoaded", () => {
  const mapWrapper = document.querySelector(".thailand-map-wrapper");
  const svg = document.getElementById("thailand-lines");
  const pins = document.querySelectorAll(".map-pin");

  if (!mapWrapper || !svg || !pins.length) return;

  function getCenter(el) {
    const rect = el.getBoundingClientRect();
    const parentRect = mapWrapper.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 - parentRect.left,
      y: rect.top + rect.height / 2 - parentRect.top
    };
  }

  function getPolaroidAnchor(polaroid) {
    const rect = polaroid.getBoundingClientRect();
    const parentRect = mapWrapper.getBoundingClientRect();
    // punkt po prawej stronie polaroidu, w 1/3 wysokości
    return {
      x: rect.left - parentRect.left,
      y: rect.top + rect.height / 3 - parentRect.top
    };
  }

  function drawLines() {
    const mapRect = mapWrapper.getBoundingClientRect();
    svg.setAttribute("width", mapRect.width);
    svg.setAttribute("height", mapRect.height);
    svg.innerHTML = "";

    pins.forEach(pin => {
      const targetSelector = pin.getAttribute("data-target");
      const polaroid = document.querySelector(targetSelector);
      if (!polaroid) return;

      const p1 = getCenter(pin);
      const p2 = getPolaroidAnchor(polaroid);

      const dx = (p2.x - p1.x) * 0.4;
      const dy = (p2.y - p1.y) * 0.2;

      const c1x = p1.x + dx;
      const c1y = p1.y + dy;
      const c2x = p2.x - dx;
      const c2y = p2.y - dy;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const d = `M ${p1.x} ${p1.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
      path.setAttribute("d", d);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "rgba(0,0,0,0.35)");
      path.setAttribute("stroke-width", "1.6");
      path.setAttribute("stroke-linecap", "round");
      svg.appendChild(path);
    });
  }

  drawLines();
  window.addEventListener("resize", () => {
    drawLines();
  });

  // opcjonalnie: kliknięcie pinezki scrolluje do polaroidu
  pins.forEach(pin => {
    pin.addEventListener("click", () => {
      const targetSelector = pin.getAttribute("data-target");
      const polaroid = document.querySelector(targetSelector);
      if (polaroid) {
        polaroid.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  });
});
