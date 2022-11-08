import Swiper, { Navigation, Pagination } from 'swiper'

Swiper.use([Navigation, Pagination])

const swiper = new Swiper('.swiper', {
  rewind: true,

  pagination: {
    el: '.swiper-pagination',
    type: 'fraction',
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
})

import { CountUp } from 'countup.js'

window.onload = function () {
  const countUp = new CountUp('fact-1', 7, { enableScrollSpy: true })
  const countUp2 = new CountUp('fact-2', 17, { enableScrollSpy: true })
  const countUp3 = new CountUp('fact-3', 9000, { enableScrollSpy: true })
  const countUp4 = new CountUp('fact-4', 1000, { enableScrollSpy: true })
  countUp.handleScroll()
  countUp2.handleScroll()
  countUp3.handleScroll()
  countUp4.handleScroll()
}

const sidebar = document.querySelector('.sidebar')
const navBtn = document.querySelector('.sidebar__toggler')
const nav = document.querySelector('.sidebar__nav')
const overlay = document.querySelector('.overlay')

navBtn.addEventListener('click', () => {
  const isNavOpen = JSON.parse(navBtn.getAttribute('data-open'))

  navBtn.setAttribute('data-open', !isNavOpen)

  !isNavOpen && nav.classList.add('active')
  isNavOpen && nav.classList.remove('active')
  !isNavOpen ? overlay.classList.add('show') : overlay.classList.remove('show')
})

sidebar.addEventListener('click', (e) => {
  if (e.target.classList.contains('sidebar__navlink')) {
    navBtnClose()
  }

  if (e.target.classList.contains('overlay')) {
    navBtnClose()
  }
})

const navBtnClose = (state) => {
  nav.classList.remove('active')
  overlay.classList.remove('show')
  navBtn.setAttribute('data-open', 'false')
}
