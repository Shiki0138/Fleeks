import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Parallax, ParallaxLayer } from '@react-spring/parallax'
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'
import './App.css'

function App() {
  const parallax = useRef(null)
  const [activeSection, setActiveSection] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // マウストラッキング
  const handleMouseMove = useCallback((e) => {
    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window
    const x = (clientX / innerWidth) * 100
    const y = (clientY / innerHeight) * 100
    setMousePosition({ x, y })
    mouseX.set(clientX)
    mouseY.set(clientY)
  }, [mouseX, mouseY])

  // シンプルなYouTubeプレイヤーコンポーネント（30秒制限付き）
  const YouTubePlayerComponent = () => {
    const [showOverlay, setShowOverlay] = useState(false)
    const [watchTime, setWatchTime] = useState(0)
    const [isVideoStarted, setIsVideoStarted] = useState(false)
    const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/embed/0Bk1GrOBR1I?autoplay=0&controls=1&rel=0&modestbranding=1&showinfo=0")
    const intervalRef = useRef(null)
    const iframeRef = useRef(null)

    useEffect(() => {
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }, [])

    const handleVideoStart = () => {
      if (!isVideoStarted && !showOverlay) {
        setIsVideoStarted(true)
        startTimer()
      }
    }

    const startTimer = () => {
      intervalRef.current = setInterval(() => {
        setWatchTime(prev => {
          const newTime = prev + 1
          if (newTime >= 30) {
            clearInterval(intervalRef.current)
            setShowOverlay(true)
            // 動画を停止
            setVideoUrl("https://www.youtube.com/embed/0Bk1GrOBR1I?autoplay=0&controls=0&rel=0&modestbranding=1&showinfo=0")
            return 30
          }
          return newTime
        })
      }, 1000)
    }
    
    return (
      <div 
        className="youtube-embed"
        style={{ position: 'relative', pointerEvents: 'auto' }}
      >
        {/* YouTube埋め込み動画 */}
        <div onClick={handleVideoStart} style={{ pointerEvents: 'auto' }}>
          <iframe
            ref={iframeRef}
            width="100%"
            height="315"
            src={videoUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{
              display: 'block',
              borderRadius: '15px',
              filter: showOverlay ? 'blur(3px)' : 'none',
              transition: 'filter 0.3s ease',
              border: 'none',
              minHeight: '315px',
              pointerEvents: showOverlay ? 'none' : 'auto'
            }}
          />
        </div>
        
        {/* プログレスバー */}
        {isVideoStarted && (
          <motion.div 
            className="video-progress"
            initial={{ width: 0 }}
            animate={{ width: `${(watchTime / 30) * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        )}
        
        {/* タイマー表示 */}
        {isVideoStarted && !showOverlay && (
          <motion.div 
            className="video-timer"
            animate={{ 
              color: watchTime > 25 ? '#ff6b6b' : '#4ecdc4',
              scale: watchTime > 25 ? [1, 1.1, 1] : 1
            }}
            transition={{ duration: 0.5 }}
          >
            {Math.max(0, 30 - watchTime)}秒
          </motion.div>
        )}
        
        
        {/* 30秒後のオーバーレイ */}
        <motion.div 
          className="video-overlay"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: showOverlay ? 1 : 0,
            scale: showOverlay ? 1 : 0.8,
            display: showOverlay ? 'flex' : 'none'
          }}
          transition={{ duration: 0.5 }}
        >
          <div className="overlay-content">
            <motion.h3
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: showOverlay ? 1 : 0 }}
              transition={{ delay: 0.2 }}
            >
              続きを見るには
            </motion.h3>
            <motion.p
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: showOverlay ? 1 : 0 }}
              transition={{ delay: 0.3 }}
            >
              メンバー限定コンテンツです
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: showOverlay ? 1 : 0 }}
              transition={{ delay: 0.4 }}
            >
              <MagneticButton 
                href="https://docs.google.com/forms/d/e/1FAIpQLSfrDmvMTBLYWdZtyTgw7xB68tu0Uk6ETvbooY-ZsoCSE2q80Q/viewform?usp=sf_link"
                className="cta-button"
              >
                <span>今すぐエントリーする</span>
                <span className="arrow">→</span>
              </MagneticButton>
            </motion.div>
          </div>
        </motion.div>
      </div>
    )
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    setIsLoaded(true)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  // パララックス背景の変形
  const backgroundTransform = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `translate3d(${x * 0.02}px, ${y * 0.02}px, 0)`
  )

  // インタラクティブカウンターコンポーネント
  // FAQアイテムコンポーネント
  const FAQItem = ({ question, answer, index }) => {
    const [isOpen, setIsOpen] = useState(false)
    
    return (
      <motion.div 
        className={`faq-item ${isOpen ? 'active' : ''}`}
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        viewport={{ once: true }}
      >
        <motion.button 
          className="faq-question"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>{question}</span>
          <motion.span 
            className="faq-arrow"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            ↓
          </motion.span>
        </motion.button>
        <motion.div 
          className="faq-answer"
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          style={{ overflow: 'hidden' }}
        >
          <p>{answer}</p>
        </motion.div>
      </motion.div>
    )
  }

  const AnimatedCounter = ({ end, suffix = '', inView }) => (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
      transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
    >
      {inView && <CountUp end={end} duration={2.5} suffix={suffix} />}
    </motion.div>
  )

  // 3Dホログラム風エフェクト
  const HologramEffect = ({ children, delay = 0 }) => (
    <motion.div
      initial={{ 
        opacity: 0, 
        scale: 0.8,
        rotateX: -15,
        z: -100
      }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        rotateX: 0,
        z: 0
      }}
      transition={{ 
        duration: 1.2, 
        delay,
        type: 'spring',
        stiffness: 100
      }}
      whileHover={{
        scale: 1.05,
        rotateY: 5,
        transition: { duration: 0.3 }
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {children}
    </motion.div>
  )

  // マグネティックボタンエフェクト
  const MagneticButton = ({ children, href, className }) => {
    const buttonRef = useRef(null)
    const [isHovered, setIsHovered] = useState(false)
    
    const handleMouseMove = (e) => {
      if (!buttonRef.current) return
      const rect = buttonRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      
      buttonRef.current.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(${isHovered ? 1.1 : 1})`
    }
    
    const handleMouseLeave = () => {
      if (!buttonRef.current) return
      buttonRef.current.style.transform = 'translate(0px, 0px) scale(1)'
      setIsHovered(false)
    }
    
    return (
      <motion.a
        ref={buttonRef}
        href={href}
        target="_blank"
        className={className}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        whileTap={{ scale: 0.95 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          transition: 'transform 0.2s ease-out'
        }}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <div className="App">
      {/* マウストラッキング背景 */}
      <motion.div 
        className="mouse-follower"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      />
      
      {/* ローディングアニメーション */}
      <motion.div
        className="loading-overlay"
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{ pointerEvents: isLoaded ? 'none' : 'auto' }}
      >
        <motion.div
          className="loading-logo"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
            scale: { duration: 1.5, repeat: Infinity }
          }}
        >
          👑
        </motion.div>
      </motion.div>

      <Parallax ref={parallax} pages={8} style={{ top: '0', left: '0' }}>
        {/* 動的背景レイヤー */}
        <ParallaxLayer
          offset={0}
          speed={0}
          factor={8}
        >
          <motion.div
            className="dynamic-background"
            style={{
              background: 'linear-gradient(45deg, #0f0f1e, #1a1a2e, #16213e, #0f3460, #1a1a2e, #0f0f1e)',
              transform: backgroundTransform
            }}
          />
          <div className="neural-network">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="neural-node"
                initial={{ 
                  opacity: 0,
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 5
                }}
              />
            ))}
          </div>
        </ParallaxLayer>

        {/* 高度なフローティング要素 */}
        <ParallaxLayer offset={0} speed={0.2}>
          <motion.div 
            className="floating-element instagram-icon" 
            style={{ left: '5%', top: '15%' }}
            animate={{
              y: [-20, 20, -20],
              rotate: [-5, 5, -5],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            whileHover={{ scale: 1.5, rotate: 15 }}
          >
            <motion.div 
              className="instagram-glow"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            />
            📱
          </motion.div>
        </ParallaxLayer>

        <ParallaxLayer offset={0.3} speed={0.5}>
          <motion.div 
            className="floating-element chart-icon" 
            style={{ right: '15%', top: '20%' }}
            animate={{
              x: [-10, 10, -10],
              y: [-15, 15, -15]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            whileHover={{ 
              scale: 1.3, 
              rotate: 360,
              transition: { duration: 0.5 }
            }}
          >
            📈
          </motion.div>
        </ParallaxLayer>

        <ParallaxLayer offset={0.8} speed={0.3}>
          <motion.div 
            className="floating-element crown-icon" 
            style={{ left: '80%', top: '60%' }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
              scale: { duration: 4, repeat: Infinity }
            }}
            whileHover={{ 
              scale: 1.5,
              y: -20,
              transition: { type: 'spring', stiffness: 300 }
            }}
          >
            👑
          </motion.div>
        </ParallaxLayer>

        <ParallaxLayer offset={1.2} speed={0.4}>
          <motion.div 
            className="floating-element money-icon" 
            style={{ left: '10%', top: '70%' }}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [-10, 10, -10]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            whileHover={{ 
              scale: 1.4,
              rotate: 720,
              transition: { duration: 1 }
            }}
          >
            💰
          </motion.div>
        </ParallaxLayer>

        <ParallaxLayer offset={2.5} speed={0.6}>
          <motion.div 
            className="floating-element robot-icon" 
            style={{ right: '10%', top: '30%' }}
            animate={{
              y: [-25, 25, -25],
              x: [-5, 5, -5]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            whileHover={{ 
              scale: 1.3,
              rotate: [0, -10, 10, 0],
              transition: { duration: 0.5 }
            }}
          >
            🤖
          </motion.div>
        </ParallaxLayer>

        {/* Hero Section - Page 1 */}
        <ParallaxLayer
          offset={0}
          speed={0.3}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <motion.div 
              className="hero-badge"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.5, type: 'spring', bounce: 0.6 }}
              whileHover={{ 
                scale: 1.1, 
                rotate: [0, -5, 5, 0],
                transition: { duration: 0.3 }
              }}
            >
              <motion.span 
                className="badge-icon"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                👑
              </motion.span>
              <span>300名突破</span>
              <div className="badge-glow"></div>
            </motion.div>
            
            <motion.h1 className="hero-title">
              <motion.span 
                className="pain-point"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                投稿しても集客できない...
              </motion.span>
              <motion.span 
                className="gradient-text solution-text"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 1.2, type: 'spring', bounce: 0.4 }}
                whileHover={{ 
                  scale: 1.05,
                  textShadow: '0 0 30px rgba(78, 205, 196, 0.8)'
                }}
              >
                その悩み、解決します。
              </motion.span>
            </motion.h1>
            
            <p className="hero-subtitle">
              効果実証済みのInstagram集客メソッドで
              <span className="mobile-break">高額広告に頼らず、</span>高単価顧客を獲得し続ける美容師に
            </p>

            <motion.div 
              className="hero-stats"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
            >
              <HologramEffect delay={0.2}>
                <div className="stat-item">
                  <motion.div 
                    className="stat-number counter"
                    whileHover={{ scale: 1.2, color: '#4ecdc4' }}
                  >
                    0→<CountUp end={27} duration={2.5} />人
                  </motion.div>
                  <div className="stat-label">入会後の集客実績</div>
                </div>
              </HologramEffect>
              <HologramEffect delay={0.4}>
                <div className="stat-item">
                  <motion.div 
                    className="stat-number counter"
                    whileHover={{ scale: 1.2, color: '#4ecdc4' }}
                  >
                    <CountUp end={75} duration={2.5} />%
                  </motion.div>
                  <div className="stat-label">2ヶ月以内成果達成率</div>
                </div>
              </HologramEffect>
              <HologramEffect delay={0.6}>
                <div className="stat-item">
                  <motion.div 
                    className="stat-number counter"
                    whileHover={{ scale: 1.2, color: '#4ecdc4' }}
                  >
                    <CountUp end={433} duration={2.5} />%
                  </motion.div>
                  <div className="stat-label">売上率UP（最高）</div>
                </div>
              </HologramEffect>
            </motion.div>

            <MagneticButton 
              href="https://docs.google.com/forms/d/e/1FAIpQLSfrDmvMTBLYWdZtyTgw7xB68tu0Uk6ETvbooY-ZsoCSE2q80Q/viewform?usp=sf_link" 
              className="cta-button primary"
            >
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                今すぐエントリーする
              </motion.span>
              <motion.span 
                className="arrow"
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </MagneticButton>

            <p className="hero-note">
              <span className="shield-icon">🛡️</span>
              解約はDM一本でOK・リスクなし
            </p>

            <motion.div 
              className="scroll-indicator" 
              onClick={() => parallax.current.scrollTo(1)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5, duration: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div className="scroll-text">
                スクロールして詳細を見る
              </motion.div>
              <motion.div 
                className="scroll-arrow"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ↓
              </motion.div>
            </motion.div>
          </motion.div>
        </ParallaxLayer>

        {/* Social Proof Section - Page 2 */}
        <ParallaxLayer
          offset={1}
          speed={0.5}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(26, 26, 46, 0.8)',
          }}
        >
          <motion.div 
            className="section-content"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="section-header">
              <span className="section-label">RESULTS</span>
              <h2 className="section-title">
                メンバーの<span className="gradient-text">圧倒的な成果</span>
              </h2>
              <p className="section-subtitle">
                全国の美容師が実践し、確実に結果を出しています
              </p>
            </div>

            <div className="testimonials-grid">
              <motion.div 
                className="testimonial-card"
                initial={{ opacity: 0, x: -100, rotateY: -15 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  boxShadow: '0 20px 60px rgba(78, 205, 196, 0.3)'
                }}
                viewport={{ once: true }}
              >
                <div className="testimonial-header">
                  <motion.div 
                    className="testimonial-icon"
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="user-avatar">👩</div>
                  </motion.div>
                  <div className="testimonial-info">
                    <h4>和田優希さん（ママ美容師）</h4>
                    <motion.div 
                      className="testimonial-rating"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      ⭐⭐⭐⭐⭐
                    </motion.div>
                  </div>
                </div>
                <motion.div 
                  className="testimonial-result"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <span className="before">入会前: 月0人</span>
                  <motion.span 
                    className="arrow"
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                  <span className="after highlight">入会後: 月<CountUp end={27} duration={2} />人</span>
                </motion.div>
                <motion.p 
                  className="testimonial-text"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  インスタ集客できるようになったおかげで、独立できたし、リピート率と新規客数が大幅にあがって驚いています。
                </motion.p>
              </motion.div>

              <div className="testimonial-card featured">
                <div className="featured-badge">BEST RESULT</div>
                <div className="testimonial-header">
                  <div className="testimonial-icon featured-icon">
                    <div className="user-avatar crown">👩‍🦱</div>
                  </div>
                  <div className="testimonial-info">
                    <h4>NATSUKIさん（髪質改善特化）</h4>
                    <div className="testimonial-rating">
                      ⭐⭐⭐⭐⭐
                    </div>
                  </div>
                </div>
                <div className="testimonial-result">
                  <span className="before">月収: 初月48万円</span>
                  <span className="arrow">→</span>
                  <span className="after highlight">最高208万円</span>
                </div>
                <p className="testimonial-text">
                  年平均売上で150万達成できたし店販も0円→30万円に。広告のPDCAサイクル、カウンセリングの見直し、店販を動画のPOPを作成してお客様に見せるだけで売上が倍になった
                </p>
              </div>

              <div className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-icon">
                    <div className="user-avatar">👨</div>
                  </div>
                  <div className="testimonial-info">
                    <h4>斎藤弘之さん（ロングヘア専門）</h4>
                    <div className="testimonial-rating">
                      ⭐⭐⭐⭐⭐
                    </div>
                  </div>
                </div>
                <div className="testimonial-result">
                  <span className="before">月間: 3人</span>
                  <span className="arrow">→</span>
                  <span className="after highlight">月100人</span>
                </div>
                <p className="testimonial-text">
                  店販売上2.5倍になり、さらに独立もできた。PDCAを回しながらの毎日投稿。ひたすらインプット&アウトプットで大きな成果に。
                </p>
              </div>
            </div>

            <div className="proof-stats">
              <div className="proof-stat">
                <div className="stat-icon">👥</div>
                <h3>300名+</h3>
                <p>アクティブメンバー</p>
              </div>
              <div className="proof-stat">
                <div className="stat-icon">🎯</div>
                <h3>求人獲得</h3>
                <p>多数のメンバーが達成</p>
              </div>
              <div className="proof-stat">
                <div className="stat-icon">📍</div>
                <h3>全国対応</h3>
                <p>都市・地方問わず</p>
              </div>
            </div>
          </motion.div>
        </ParallaxLayer>

        {/* Problem Section - Page 3 */}
        <ParallaxLayer
          offset={2}
          speed={0.5}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="section-content">
            <div className="problem-section">
              <h2 className="problem-title">
                なぜ、頑張って投稿しても
                <span className="mobile-break underline">お客様が増えないのか？</span>
              </h2>
              
              <div className="problem-cards">
                <div className="problem-card">
                  <div className="problem-icon">❌</div>
                  <h3>見た目重視の投稿</h3>
                  <p>オシャレな写真ばかりで、顧客の悩みに響かない</p>
                </div>
                <div className="problem-card">
                  <div className="problem-icon">❌</div>
                  <h3>ターゲット不明確</h3>
                  <p>誰に向けた投稿か分からず、誰にも刺さらない</p>
                </div>
                <div className="problem-card">
                  <div className="problem-icon">❌</div>
                  <h3>集客導線の欠如</h3>
                  <p>フォロワーは増えても予約に繋がらない</p>
                </div>
              </div>
            </div>
          </div>
        </ParallaxLayer>

        {/* Solution Section - Page 4 */}
        <ParallaxLayer
          offset={3}
          speed={0.5}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(26, 26, 46, 0.8)',
          }}
        >
          <div className="section-content">
            <div className="solution-block">
              <div className="solution-arrow">
                <div className="arrow-icon">↓</div>
              </div>
              
              <h2 className="solution-title">
                実は、Instagram集客には
                <span className="mobile-break gradient-text">「型」が存在します</span>
              </h2>
              
              <div className="solution-story">
                <div className="story-content">
                  <h3>同じ悩みを抱えていました</h3>
                  <p>
                    5年前、私も毎日投稿しているのに全く集客できず、
                    ホットペッパーの広告費に月30万円も使っていました。
                  </p>
                  <p>
                    しかし、ある「集客の型」に出会ってから状況は一変。
                    <strong>3ヶ月で広告費ゼロ、売上3倍</strong>を実現しました。
                  </p>
                  <p>
                    成功法則を体系化し、誰でも再現できるメソッドとして
                    確立したのが、Fleeksの集客システムです。
                  </p>
                </div>
                <div className="story-visual">
                  <div className="story-illustration">
                    <div className="success-chart">
                      <div className="chart-bar" style={{height: '30%'}}></div>
                      <div className="chart-bar" style={{height: '60%'}}></div>
                      <div className="chart-bar" style={{height: '90%'}}></div>
                      <div className="chart-bar active" style={{height: '100%'}}></div>
                    </div>
                    <div className="growth-arrow">📈</div>
                  </div>
                  <div className="story-badge">
                    <span className="check-icon">✅</span>
                    実証済みメソッド
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ParallaxLayer>

        {/* Benefits Section - Page 5 */}
        <ParallaxLayer
          offset={4}
          speed={0.5}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="section-content">
            <div className="section-header">
              <span className="section-label">BENEFITS</span>
              <h2 className="section-title">
                Fleeksで得られる<span className="gradient-text">6つの価値</span>
              </h2>
            </div>

            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">🧠</div>
                <h3>顧客心理×マーケ思考</h3>
                <p>美容業界特化の顧客心理とマーケティング理論を同時習得</p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">🎯</div>
                <h3>再現性抜群の型</h3>
                <p>都会でも地方でも結果が出る実証済みの集客フレームワーク</p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">♾️</div>
                <h3>一生使えるスキル</h3>
                <p>SNSが変わっても通用する本質的な集客力が身につく</p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">🚀</div>
                <h3>即効性のある実践</h3>
                <p>学んだその日から使える具体的なテクニックを提供</p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">👥</div>
                <h3>切磋琢磨する仲間</h3>
                <p>全国の成功を目指す美容師と繋がり高め合える環境</p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">📊</div>
                <h3>経営者視点の獲得</h3>
                <p>独立・求人・店舗展開にも活用できる経営マインド</p>
              </div>
            </div>
          </div>
        </ParallaxLayer>

        {/* Video Content Section - Page 6 */}
        <ParallaxLayer
          offset={5}
          speed={0.5}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <motion.div 
            className="section-content"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="section-header">
              <span className="section-label">LEARNING</span>
              <h2 className="section-title">
                実践的な<span className="gradient-text">動画コンテンツ</span>で学ぶ
              </h2>
            </div>

            <div className="video-showcase">
              <div className="main-video">
                <HologramEffect delay={0.3}>
                  <div className="video-wrapper">
                    <YouTubePlayerComponent />
                    <motion.div 
                      className="video-info"
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      <h3>実際の成功事例と具体的ノウハウを公開</h3>
                      <p>YouTubeで定期配信中の最新情報をサロンメンバーには更に詳しく</p>
                      <motion.a 
                        href="https://www.instagram.com/shiki_fp_138/" 
                        target="_blank" 
                        className="instagram-link"
                        whileHover={{ scale: 1.05, color: '#e1306c' }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>📱</span>
                        Instagram @shiki_fp_138 をフォロー
                      </motion.a>
                    </motion.div>
                  </div>
                </HologramEffect>
              </div>

              <motion.div 
                className="video-features"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <HologramEffect delay={0.1}>
                  <div className="video-feature">
                    <motion.div 
                      className="feature-icon"
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      📹
                    </motion.div>
                    <h4>週次ライブ配信</h4>
                    <p>最新事例と実践テクニックを毎週更新</p>
                  </div>
                </HologramEffect>
                <HologramEffect delay={0.2}>
                  <div className="video-feature">
                    <motion.div 
                      className="feature-icon"
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      📁
                    </motion.div>
                    <h4>過去動画見放題</h4>
                    <p>過去動画見放題でいつでも復習</p>
                  </div>
                </HologramEffect>
                <HologramEffect delay={0.3}>
                  <div className="video-feature">
                    <motion.div 
                      className="feature-icon"
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      💬
                    </motion.div>
                    <h4>質問し放題</h4>
                    <p>分からないことは即座に解決</p>
                  </div>
                </HologramEffect>
              </motion.div>
            </div>
          </motion.div>
        </ParallaxLayer>

        {/* AI/Innovation Section - Page 6 */}
        <ParallaxLayer
          offset={6}
          speed={0.5}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(26, 26, 46, 0.9)',
          }}
        >
          <div className="section-content">
            <div className="ai-section">
              <div className="section-header">
                <span className="section-label">INNOVATION</span>
                <h2 className="section-title">
                  最新AI×マーケティング戦略も
                  <span className="mobile-break gradient-text">いち早く習得</span>
                </h2>
              </div>

              <div className="ai-content">
                <div className="ai-text">
                  <h3>
                    <span className="robot-icon">🤖</span>
                    生成AIを活用した美容師の業務改善戦略
                  </h3>
                  <p>
                    ChatGPTなど生成AIを美容業界に特化した活用法。
                    美容師向けにこの情報を発信しているマーケターは他にいません。
                  </p>
                  <ul className="ai-features">
                    <li>
                      <span className="check-icon">✅</span>
                      独自開発のAIインスタ投稿生成ツールへアクセス
                    </li>
                    <li>
                      <span className="check-icon">✅</span>
                      フォロワー・リーチ数予測機能付き
                    </li>
                    <li>
                      <span className="check-icon">✅</span>
                      カウンセリング自動化システム
                    </li>
                    <li>
                      <span className="check-icon">✅</span>
                      最新AIツールの優先提供（一般非公開）
                    </li>
                  </ul>
                  <div className="ai-badge">
                    <span className="award-icon">🏆</span>
                    独自開発のAIツールで美容業界に革命を
                  </div>
                  <a href="https://trgraqfo.gensparkspace.com/" target="_blank" className="ai-tool-demo">
                    <span className="external-icon">🔗</span>
                    実際のAIツールを体験する
                  </a>
                </div>
                <div className="ai-visual">
                  <div className="ai-demo">
                    <div className="ai-screen">
                      <div className="typing-animation">
                        <span className="typing-text">Instagram投稿を自動生成中...</span>
                        <span className="cursor">|</span>
                      </div>
                    </div>
                    <div className="ai-particles">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ParallaxLayer>

        {/* Offer Section - Page 7 */}
        <ParallaxLayer
          offset={6}
          speed={0.5}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="section-content">
            <div className="offer-box">
              <div className="offer-header">
                <h2>今すぐ始める</h2>
                <div className="offer-badge">
                  <span className="fire-icon">🔥</span>
                  期間限定価格
                </div>
              </div>

              <div className="offer-content">
                <div className="price-block">
                  <div className="original-price">
                    <span>通常価格</span>
                    <s>¥8,980</s>
                  </div>
                  <div className="current-price">
                    <span className="price-label">今だけ</span>
                    <span className="price-amount">¥7,980</span>
                    <span className="price-period">/月</span>
                  </div>
                  <p className="price-note">
                    <span className="info-icon">💡</span>
                    ホットペッパーの最低価格で一生モノのスキルが身につく
                  </p>
                </div>

                <div className="offer-benefits">
                  <h3>含まれるもの</h3>
                  <ul>
                    <li><span className="check-icon">✅</span> 週次Zoom勉強会（録画あり）</li>
                    <li><span className="check-icon">✅</span> 過去動画見放題</li>
                    <li><span className="check-icon">✅</span> 最新AI活用ノウハウ</li>
                    <li><span className="check-icon">✅</span> 成功事例の共有</li>
                    <li><span className="check-icon">✅</span> 業務改善システム優先販売</li>
                    <li><span className="check-icon">✅</span> 特別ゲスト講座</li>
                  </ul>
                </div>

                <div className="urgency-message">
                  <span className="warning-icon">⚠️</span>
                  <p>
                    <strong>※定員に達し次第、募集を停止します</strong><br />
                    現在の空き枠: <span className="slots-left">残り7名</span>
                  </p>
                </div>

                <a href="https://docs.google.com/forms/d/e/1FAIpQLSfrDmvMTBLYWdZtyTgw7xB68tu0Uk6ETvbooY-ZsoCSE2q80Q/viewform?usp=sf_link" target="_blank" className="cta-button large">
                  <span>今すぐエントリーする</span>
                  <span className="arrow">→</span>
                </a>

                <div className="guarantee">
                  <span className="shield-icon">🛡️</span>
                  <p>
                    安心の保証<br />
                    <strong>解約はDM一本でOK</strong>・煩わしい手続き一切なし
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ParallaxLayer>

        {/* FAQ Section - Page 8 */}
        <ParallaxLayer
          offset={7}
          speed={0.5}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(20, 20, 35, 0.8)',
          }}
        >
          <motion.div 
            className="section-content"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="section-header">
              <span className="section-label">FAQ</span>
              <h2 className="section-title">よくある質問</h2>
            </div>

            <div className="faq-list">
              {[
                {
                  question: "どれくらいで集客効果が出ますか？",
                  answer: "個人差はありますが、早い方で1ヶ月、平均して2-3ヶ月で明確な集客効果を実感いただいています。型通りに実践すれば必ず結果は出ます。"
                },
                {
                  question: "毎日投稿できなくても大丈夫ですか？",
                  answer: "はい、大丈夫です。量より質を重視した投稿戦略をお教えします。週3-4回の投稿でも十分な効果が期待できます。"
                },
                {
                  question: "地方でも効果はありますか？",
                  answer: "むしろ地方の方が競合が少なく、効果が出やすい傾向にあります。地域特性を活かした集客戦略も個別にアドバイスしています。"
                },
                {
                  question: "スタイリストでも参加できますか？",
                  answer: "もちろんです。フリーランス準備中の方からサロンオーナーまで幅広く参加いただいています。それぞれの立場に合わせたアドバイスを提供します。"
                },
                {
                  question: "途中解約はできますか？",
                  answer: "いつでも解約可能です。DMを1通送るだけで完了。違約金や面倒な手続きは一切ありません。まずは1ヶ月お試しください。"
                }
              ].map((item, index) => (
                <FAQItem key={index} question={item.question} answer={item.answer} index={index} />
              ))}
            </div>

            <div className="final-cta-section" style={{ marginTop: '60px' }}>
              <h2>
                将来への不安を、<br />
                <span className="gradient-text">確かな自信に変える</span>
              </h2>
              <p>
                ホットペッパーに頼らない集客力を身につけ、<br />
                理想の美容師人生を実現しませんか？
              </p>
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSfrDmvMTBLYWdZtyTgw7xB68tu0Uk6ETvbooY-ZsoCSE2q80Q/viewform?usp=sf_link" target="_blank" className="cta-button primary large">
                <span>今すぐエントリーする</span>
                <span className="arrow">→</span>
              </a>
              <p className="final-note">
                <span className="clock-icon">⏰</span>
                今なら24時間以内に返信します
              </p>
            </div>
          </motion.div>
        </ParallaxLayer>

        {/* Navigation dots */}
        <ParallaxLayer
          offset={0}
          speed={0}
          style={{
            position: 'fixed',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 100,
          }}
        >
          <div className="nav-dots">
            <button onClick={() => parallax.current.scrollTo(0)} className={`nav-dot ${activeSection === 0 ? 'active' : ''}`} title="ヒーロー" />
            <button onClick={() => parallax.current.scrollTo(1)} className={`nav-dot ${activeSection === 1 ? 'active' : ''}`} title="実績" />
            <button onClick={() => parallax.current.scrollTo(2)} className={`nav-dot ${activeSection === 2 ? 'active' : ''}`} title="問題" />
            <button onClick={() => parallax.current.scrollTo(3)} className={`nav-dot ${activeSection === 3 ? 'active' : ''}`} title="解決" />
            <button onClick={() => parallax.current.scrollTo(4)} className={`nav-dot ${activeSection === 4 ? 'active' : ''}`} title="特典" />
            <button onClick={() => parallax.current.scrollTo(5)} className={`nav-dot ${activeSection === 5 ? 'active' : ''}`} title="動画" />
            <button onClick={() => parallax.current.scrollTo(6)} className={`nav-dot ${activeSection === 6 ? 'active' : ''}`} title="申込" />
            <button onClick={() => parallax.current.scrollTo(7)} className={`nav-dot ${activeSection === 7 ? 'active' : ''}`} title="FAQ" />
          </div>
        </ParallaxLayer>
      </Parallax>
    </div>
  )
}

export default App
