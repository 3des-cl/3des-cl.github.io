// JavaScript mínimo del sitio: menú móvil, página activa en el menú,
// sombra de la cabecera al desplazarse y formulario de contacto que arma el
// mensaje de WhatsApp. Sin dependencias. Todo el contenido se ve sin JS.
(function () {
  'use strict'

  var boton = document.querySelector('[data-menu-boton]')
  var menu = document.querySelector('[data-menu]')
  if (boton && menu) {
    boton.addEventListener('click', function () {
      var abierto = boton.getAttribute('aria-expanded') === 'true'
      boton.setAttribute('aria-expanded', abierto ? 'false' : 'true')
      menu.classList.toggle('menu--abierto', !abierto)
      document.documentElement.classList.toggle('menu-abierto', !abierto)
    })
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && boton.getAttribute('aria-expanded') === 'true') boton.click()
    })
  }

  // Página activa: el <main> dice cuál es y el menú la marca.
  var main = document.querySelector('main[data-pagina]')
  if (main) {
    var actual = main.getAttribute('data-pagina')
    var enlaces = document.querySelectorAll('[data-nav="' + actual + '"]')
    for (var i = 0; i < enlaces.length; i++) enlaces[i].setAttribute('aria-current', 'page')
  }

  var cabecera = document.querySelector('[data-cabecera]')
  if (cabecera) {
    var marcar = function () { cabecera.classList.toggle('cabecera--con-sombra', window.scrollY > 8) }
    marcar()
    window.addEventListener('scroll', marcar, { passive: true })
  }

  // Formulario de contacto: arma el mensaje y lo abre en WhatsApp.
  var form = document.querySelector('[data-form-wa]')
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault()
      // Cada campo con data-rotulo se agrega como "Rótulo: valor." en el orden del formulario.
      var partes = [form.getAttribute('data-saludo') || 'Hola 3DES, quiero cotizar.']
      for (var i = 0; i < form.elements.length; i++) {
        var el = form.elements[i]
        var valor = (el.value || '').trim()
        if (!el.name || !valor || !el.getAttribute('data-rotulo')) continue
        partes.push(el.getAttribute('data-rotulo') + ': ' + valor.replace(/[.\s]+$/, '') + '.')
      }
      var url = form.getAttribute('data-form-wa') + '?text=' + encodeURIComponent(partes.join(' '))
      window.open(url, '_blank', 'noopener')
    })
  }

  // Luz que sigue al puntero en las teselas que la piden (data-luz).
  document.querySelectorAll('[data-luz]').forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect()
      el.style.setProperty('--x', (e.clientX - r.left) + 'px')
      el.style.setProperty('--y', (e.clientY - r.top) + 'px')
    })
  })

  // Animación de entrada suave para tarjetas y secciones (sin JS se ven igual).
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('visible'); obs.unobserve(en.target) } })
    }, { rootMargin: '0px 0px -10% 0px' })
    document.querySelectorAll('.aparece').forEach(function (el) { obs.observe(el) })
  }

  // Pestañas que filtran piezas por línea (data-pestanas). Patrón de pestañas de WAI-ARIA:
  // clic o teclado (flechas, Inicio, Fin) activa una pestaña y muestra solo su panel.
  document.querySelectorAll('[data-pestanas]').forEach(function (grupo) {
    var tabs = [].slice.call(grupo.querySelectorAll('[role="tab"]'))
    function activar (tab, enfocar) {
      tabs.forEach(function (t) {
        var activa = t === tab
        t.setAttribute('aria-selected', activa ? 'true' : 'false')
        t.tabIndex = activa ? 0 : -1
        var panel = document.getElementById(t.getAttribute('aria-controls'))
        if (panel) panel.hidden = !activa
      })
      if (enfocar) tab.focus()
      // En celular las pestañas van en una fila con desplazamiento: la activa queda a la vista.
      var fila = tab.parentNode
      if (fila.scrollWidth > fila.clientWidth) fila.scrollTo({ left: fila.scrollLeft + tab.getBoundingClientRect().left - fila.getBoundingClientRect().left - (fila.clientWidth - tab.offsetWidth) / 2, behavior: 'smooth' })
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { activar(tab, false) })
      tab.addEventListener('keydown', function (e) {
        var destino = null
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') destino = tabs[(i + 1) % tabs.length]
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') destino = tabs[(i - 1 + tabs.length) % tabs.length]
        else if (e.key === 'Home') destino = tabs[0]
        else if (e.key === 'End') destino = tabs[tabs.length - 1]
        if (destino) { e.preventDefault(); activar(destino, true) }
      })
    })
  })
})()
