import { FormEvent, useEffect, useRef, useState } from 'react'

type Theme = 'light' | 'dark'
type FormState = 'idle' | 'loading' | 'success' | 'error'

const assets = {
  iconDark: '/assets/pipocadev-icon-dark.jpg',
  iconLight: '/assets/pipocadev-icon-light.jpg',
  lockupDark: '/assets/pipocadev-lockup-dark.jpg',
  lockupLight: '/assets/pipocadev-lockup-light.jpg',
  studioModel: '/assets/projeto-estudio-modelo.webp',
  boutiqueModel: '/assets/projeto-pequena-estacao.webp',
  portrait: '/assets/luara.webp',
}

const whatsappNumber = '5541987760721'
const whatsappLabel = '(41) 98776-0721'
const whatsappLink = (message: string) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

const navigation = [
  ['Início', '#inicio'],
  ['Projetos', '#projetos'],
  ['Serviços', '#servicos'],
  ['Planos', '#planos'],
  ['Sobre', '#sobre'],
  ['Contato', '#contato'],
] as const

function getInitialTheme(): Theme {
  const stored = localStorage.getItem('pipocadev-theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function BrandIcon() {
  return (
    <span className="brand-icon" aria-hidden="true">
      <img className="only-light" src={assets.iconLight} alt="" width="1280" height="1280" />
      <img className="only-dark" src={assets.iconDark} alt="" width="1280" height="1280" />
    </span>
  )
}

function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [menuOpen, setMenuOpen] = useState(false)
  const [formState, setFormState] = useState<FormState>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const firstMenuLink = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    localStorage.setItem('pipocadev-theme', theme)

    const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    const favicon = document.querySelector<HTMLLinkElement>('#favicon')
    themeColor?.setAttribute('content', theme === 'dark' ? '#2a1d14' : '#fcf5eb')
    favicon?.setAttribute('href', theme === 'dark' ? assets.iconDark : assets.iconLight)
  }, [theme])

  useEffect(() => {
    if (menuOpen) firstMenuLink.current?.focus()

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [menuOpen])

  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-visible', 'true')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14 },
    )

    revealItems.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const briefing = [
      'Briefing criado no site da PipocaDev',
      '',
      `Nome: ${data.get('name')}`,
      `E-mail: ${data.get('email')}`,
      `Tipo de projeto: ${data.get('projectType')}`,
      '',
      'Mensagem:',
      String(data.get('message')),
    ].join('\n')

    setFormState('loading')
    setStatusMessage('Preparando seu briefing para download.')

    window.setTimeout(() => {
      try {
        const blob = new Blob([briefing], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const download = document.createElement('a')
        download.href = url
        download.download = 'briefing-pipocadev.txt'
        document.body.appendChild(download)
        download.click()
        download.remove()
        URL.revokeObjectURL(url)
        setFormState('success')
        setStatusMessage('Briefing baixado. Agora é só enviá-lo para a PipocaDev pelo WhatsApp.')
      } catch {
        setFormState('error')
        setStatusMessage('Não foi possível gerar o arquivo. Revise os campos e tente novamente.')
      }
    }, 500)
  }

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>

      <header className="site-header">
        <div className="header-inner">
          <a className="brand-link" href="#inicio" aria-label="PipocaDev, voltar ao início">
            <BrandIcon />
            <span className="brand-word"><strong>pipoca</strong>dev</span>
          </a>

          <nav className="desktop-nav" aria-label="Navegação principal">
            {navigation.map(([label, href]) => (
              <a key={href} href={href}>{label}</a>
            ))}
          </nav>

          <div className="header-actions">
            <button
              className="theme-toggle"
              type="button"
              aria-label={`Ativar tema ${theme === 'light' ? 'escuro' : 'claro'}`}
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <span aria-hidden="true" className="theme-orbit"><span /></span>
              <span>{theme === 'light' ? 'Escuro' : 'Claro'}</span>
            </button>
            <button
              className="menu-toggle"
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((current) => !current)}
            >
              <span>Menu</span>
              <span className="menu-lines" aria-hidden="true"><i /><i /></span>
            </button>
          </div>
        </div>

        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Navegação em telas pequenas"
          data-open={menuOpen}
        >
          {navigation.map(([label, href], index) => (
            <a
              key={href}
              ref={index === 0 ? firstMenuLink : undefined}
              href={href}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
            >
              <span>0{index + 1}</span>{label}
            </a>
          ))}
        </nav>
      </header>

      <main id="conteudo">
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="hero-kicker">Seu site num estalo</p>
            <h1 id="hero-title">Sites que dão vontade de <span>clicar.</span></h1>
            <p className="hero-intro">A PipocaDev cria experiências digitais com identidade, clareza e atenção a cada tela.</p>
            <div className="hero-actions">
              <a className="button button-primary" href={whatsappLink('Olá, PipocaDev! Quero conversar sobre a criação do meu site.')} target="_blank" rel="noreferrer">Pedir orçamento</a>
              <a className="button button-secondary" href="#projetos">Ver projetos</a>
            </div>
            <div className="brand-rail" aria-hidden="true"><span /></div>
          </div>

          <div className="hero-visual" aria-label="Identidade visual da PipocaDev">
            <div className="kernel-cluster" aria-hidden="true">
              <span /><span /><span /><span /><span />
            </div>
            <div className="lockup-frame">
              <img className="only-light" src={assets.lockupLight} alt="PipocaDev, seu site num estalo" width="1280" height="914" />
              <img className="only-dark" src={assets.lockupDark} alt="PipocaDev, seu site num estalo" width="1280" height="914" />
            </div>
            <p className="visual-note">Código com gosto de marca própria.</p>
          </div>
        </section>

        <section className="projects section-shell" id="projetos" aria-labelledby="projects-title">
          <div className="section-heading" data-reveal>
            <p className="section-number">01 / Projetos</p>
            <h2 id="projects-title">Dois caminhos, uma ideia: cada site pede uma voz.</h2>
            <p>Modelos autorais desenvolvidos para demonstrar direção visual, organização de conteúdo e experiência responsiva. Não representam clientes reais.</p>
          </div>

          <div className="project-list">
            <article className="project-featured" data-reveal>
              <a className="project-image" href="https://modelo-arquitetura-editorial.vercel.app/" target="_blank" rel="noreferrer" aria-label="Abrir o projeto demonstrativo Estúdio Modelo">
                <img src={assets.studioModel} alt="Página inicial do Estúdio Modelo, projeto demonstrativo para arquitetura" width="1440" height="5776" loading="lazy" />
              </a>
              <div className="project-copy">
                <p className="project-kind">Projeto demonstrativo / Arquitetura</p>
                <h3>Estúdio Modelo</h3>
                <p>Um site institucional de linguagem editorial para apresentar arquitetura, interiores e paisagismo com ritmo calmo e bastante espaço para as imagens.</p>
                <dl>
                  <div><dt>Desenvolvimento</dt><dd>Direção visual, conteúdo demonstrativo, interface e responsividade</dd></div>
                  <div><dt>Tecnologias</dt><dd>HTML, CSS e JavaScript</dd></div>
                </dl>
                <a className="text-link" href="https://modelo-arquitetura-editorial.vercel.app/" target="_blank" rel="noreferrer">Visitar o modelo</a>
              </div>
            </article>

            <article className="project-secondary" data-reveal>
              <a className="project-image" href="https://modelo-boutique-infantil.vercel.app/" target="_blank" rel="noreferrer" aria-label="Abrir o projeto demonstrativo Pequena Estação">
                <img src={assets.boutiqueModel} alt="Página inicial da Pequena Estação, projeto demonstrativo para boutique infantil" width="1440" height="1000" loading="lazy" />
              </a>
              <div className="project-copy">
                <p className="project-kind">Projeto demonstrativo / Boutique infantil</p>
                <h3>Pequena Estação</h3>
                <p>Um modelo de loja com apresentação editorial, catálogo de nove peças, filtros e percurso pensado para levar o visitante até o atendimento.</p>
                <dl>
                  <div><dt>Desenvolvimento</dt><dd>Identidade demonstrativa, catálogo, filtros, interface e responsividade</dd></div>
                  <div><dt>Tecnologias</dt><dd>HTML, CSS e JavaScript</dd></div>
                </dl>
                <a className="text-link" href="https://modelo-boutique-infantil.vercel.app/" target="_blank" rel="noreferrer">Visitar o modelo</a>
              </div>
            </article>
          </div>
        </section>

        <section className="services" id="servicos" aria-labelledby="services-title">
          <div className="services-intro" data-reveal>
            <p className="section-number">02 / Serviços</p>
            <h2 id="services-title">O que sustenta um site bem resolvido.</h2>
            <p>Da página única ao site com mais estrutura, cada entrega parte de um escopo claro e termina com o projeto publicado.</p>
          </div>

          <ol className="service-list">
            <li data-reveal>
              <span>01</span>
              <div><h3>Site One Page</h3><p>Uma página responsiva com apresentação, serviços, contato, WhatsApp e publicação online.</p></div>
            </li>
            <li data-reveal>
              <span>02</span>
              <div><h3>Site institucional</h3><p>Uma estrutura mais completa com início, sobre, serviços, diferenciais, FAQ, localização e contato.</p></div>
            </li>
            <li data-reveal>
              <span>03</span>
              <div><h3>Site completo</h3><p>Mais páginas e organização para negócios com vários serviços ou necessidades específicas.</p></div>
            </li>
            <li data-reveal>
              <span>04</span>
              <div><h3>Ajustes e novas páginas</h3><p>Alterações futuras, novas seções e novas páginas podem ser contratadas conforme a complexidade.</p></div>
            </li>
          </ol>
        </section>

        <section className="pricing section-shell" id="planos" aria-labelledby="pricing-title">
          <div className="section-heading" data-reveal>
            <p className="section-number">03 / Planos</p>
            <h2 id="pricing-title">Um ponto de partida para cada tamanho de projeto.</h2>
            <p>Os valores são faixas de referência. O orçamento final considera conteúdo, complexidade, urgência e recursos necessários.</p>
          </div>

          <div className="pricing-grid">
            <article className="price-card" data-reveal>
              <p className="price-index">01</p>
              <h3>Site One Page</h3>
              <p className="price">R$ 500 <span>a R$ 700</span></p>
              <p>Para profissionais autônomos, prestadores de serviço e pequenos negócios que precisam começar bem na internet.</p>
              <ul>
                <li>Página única e responsiva</li>
                <li>Apresentação, serviços e contato</li>
                <li>WhatsApp e publicação online</li>
              </ul>
              <p className="timeline">Prazo médio: 5 a 7 dias úteis</p>
              <a className="button button-secondary" href={whatsappLink('Olá, PipocaDev! Quero um orçamento para o plano Site One Page.')} target="_blank" rel="noreferrer">Quero este plano</a>
            </article>

            <article className="price-card price-card-accent" data-reveal>
              <p className="price-index">02</p>
              <h3>Site institucional</h3>
              <p className="price">R$ 700 <span>a R$ 1.200</span></p>
              <p>Para clínicas, escritórios, empresas locais e profissionais que precisam apresentar melhor sua atuação.</p>
              <ul>
                <li>Início, sobre, serviços e diferenciais</li>
                <li>FAQ, localização e contato</li>
                <li>WhatsApp e publicação online</li>
              </ul>
              <p className="timeline">Prazo médio: 7 a 10 dias úteis</p>
              <a className="button button-primary" href={whatsappLink('Olá, PipocaDev! Quero um orçamento para o plano Site Institucional.')} target="_blank" rel="noreferrer">Quero este plano</a>
            </article>

            <article className="price-card price-card-wide" data-reveal>
              <div>
                <p className="price-index">03</p>
                <h3>Site completo</h3>
                <p className="price">A partir de R$ 1.200</p>
              </div>
              <div>
                <p>Para negócios que precisam de mais páginas, mais serviços ou uma estrutura feita sob medida.</p>
                <ul>
                  <li>Início, sobre, serviços e contato</li>
                  <li>Páginas adicionais conforme a necessidade</li>
                  <li>WhatsApp e publicação online</li>
                </ul>
                <p className="timeline">Prazo médio: 10 a 15 dias úteis</p>
                <a className="text-link" href={whatsappLink('Olá, PipocaDev! Quero conversar sobre um site completo.')} target="_blank" rel="noreferrer">Conversar sobre o escopo</a>
              </div>
            </article>
          </div>

        </section>

        <section className="about section-shell" id="sobre" aria-labelledby="about-title">
          <div className="about-image" data-reveal>
            <img src={assets.portrait} alt="Retrato de Luara, criadora da PipocaDev" width="800" height="800" loading="lazy" />
            <p>Luara / PipocaDev</p>
          </div>
          <div className="about-copy" data-reveal>
            <p className="section-number">04 / Sobre</p>
            <h2 id="about-title">Oi, eu sou a Luara.</h2>
            <p className="about-lede">Tenho 29 anos e trabalho na área de tecnologia há mais de 10 anos. Na PipocaDev, junto essa experiência a um olhar atento para transformar ideias em sites claros, responsivos e com identidade.</p>
            <p>Gosto de projetos que precisam organizar uma presença digital de um jeito direto, profissional e próximo. Cuido da estrutura, do visual e dos detalhes para que cada site funcione bem em diferentes telas.</p>
          </div>
        </section>

        <section className="contact" id="contato" aria-labelledby="contact-title">
          <div className="contact-heading" data-reveal>
            <p className="section-number">05 / Contato</p>
            <h2 id="contact-title">Tem um projeto esperando para estourar?</h2>
            <p>Conte o que você precisa e vamos entender o melhor formato para colocar seu site no ar.</p>
            <a className="contact-whatsapp" href={whatsappLink('Olá, PipocaDev! Quero conversar sobre meu site.')} target="_blank" rel="noreferrer">
              <span>Chamar no WhatsApp</span>
              <strong>{whatsappLabel}</strong>
            </a>
          </div>

          <form className="brief-form" onSubmit={handleSubmit} data-reveal>
            <div className="field-row">
              <label>
                <span>Seu nome</span>
                <input name="name" autoComplete="name" required placeholder="Como podemos chamar você?" />
              </label>
              <label>
                <span>Seu e-mail</span>
                <input name="email" type="email" autoComplete="email" required placeholder="voce@exemplo.com" />
              </label>
            </div>
            <label>
              <span>Tipo de projeto</span>
              <select name="projectType" required defaultValue="">
                <option value="" disabled>Selecione uma opção</option>
                <option>Site One Page</option>
                <option>Site institucional</option>
                <option>Site completo</option>
                <option>Outro formato de site</option>
              </select>
            </label>
            <label>
              <span>O que você precisa?</span>
              <textarea name="message" rows={5} required minLength={20} placeholder="Conte o objetivo do site, o público e o que já existe." />
            </label>
            <div className="form-footer">
              <button className="button button-primary" type="submit" disabled={formState === 'loading'}>
                {formState === 'loading' ? 'Preparando briefing' : 'Baixar meu briefing'}
              </button>
              <p className="privacy-note">Nenhum dado sai deste navegador.</p>
            </div>
            <a className="form-whatsapp" href={whatsappLink('Olá, PipocaDev! Já preparei meu briefing e quero enviar os detalhes do projeto.')} target="_blank" rel="noreferrer">Continuar pelo WhatsApp</a>
            <p className={`form-status ${formState}`} role={formState === 'error' ? 'alert' : 'status'} aria-live="polite">
              {statusMessage}
            </p>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <a className="footer-brand" href="#inicio" aria-label="PipocaDev, voltar ao início">
          <BrandIcon />
          <span><strong>pipoca</strong>dev<small>Seu site num estalo</small></span>
        </a>
        <p>Criação de sites com identidade, clareza e atenção a cada tela.</p>
        <a className="footer-contact" href={whatsappLink('Olá, PipocaDev! Quero conversar sobre meu site.')} target="_blank" rel="noreferrer">WhatsApp {whatsappLabel}</a>
        <a className="back-top" href="#inicio">Voltar ao início</a>
      </footer>
    </>
  )
}

export default App
