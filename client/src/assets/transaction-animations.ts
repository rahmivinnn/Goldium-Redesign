// Transaction Animation System with K1-K8 Images

export interface AnimationConfig {
  id: string;
  image: string;
  duration: number;
  scale: number;
  rotation: number;
  opacity: number;
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// K1-K8 Animation Configurations (CSS-based)
export const TRANSACTION_ANIMATIONS: AnimationConfig[] = [
  {
    id: 'K1',
    image: 'css-animation', // Using CSS animation instead of GIF
    duration: 2000,
    scale: 1.2,
    rotation: 360,
    opacity: 0.9,
    position: 'center'
  },
  {
    id: 'K2',
    image: 'css-animation',
    duration: 1500,
    scale: 1.1,
    rotation: 180,
    opacity: 0.8,
    position: 'top-right'
  },
  {
    id: 'K3',
    image: 'css-animation',
    duration: 2500,
    scale: 1.3,
    rotation: 720,
    opacity: 1.0,
    position: 'center'
  },
  {
    id: 'K4',
    image: 'css-animation',
    duration: 1800,
    scale: 1.4,
    rotation: 0,
    opacity: 0.9,
    position: 'bottom-right'
  },
  {
    id: 'K5',
    image: 'css-animation',
    duration: 1200,
    scale: 1.0,
    rotation: 90,
    opacity: 0.8,
    position: 'top-left'
  },
  {
    id: 'K6',
    image: 'css-animation',
    duration: 3000,
    scale: 1.5,
    rotation: 540,
    opacity: 0.7,
    position: 'center'
  },
  {
    id: 'K7',
    image: 'css-animation',
    duration: 2200,
    scale: 1.2,
    rotation: 270,
    opacity: 0.9,
    position: 'bottom-left'
  },
  {
    id: 'K8',
    image: 'css-animation',
    duration: 2800,
    scale: 1.6,
    rotation: 360,
    opacity: 1.0,
    position: 'center'
  }
];

// Animation Manager Class
export class AnimationManager {
  private static instance: AnimationManager;
  private currentAnimation: HTMLDivElement | null = null;
  private animationQueue: AnimationConfig[] = [];

  private constructor() {}

  public static getInstance(): AnimationManager {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager();
    }
    return AnimationManager.instance;
  }

  // Show random animation
  public showRandomAnimation(): void {
    const randomIndex = Math.floor(Math.random() * TRANSACTION_ANIMATIONS.length);
    const animation = TRANSACTION_ANIMATIONS[randomIndex];
    this.showAnimation(animation);
  }

  // Show specific animation by ID
  public showAnimationById(id: string): void {
    const animation = TRANSACTION_ANIMATIONS.find(a => a.id === id);
    if (animation) {
      this.showAnimation(animation);
    }
  }

  // Show animation with config
  public showAnimation(config: AnimationConfig): void {
    // Add to queue if animation is already playing
    if (this.currentAnimation) {
      this.animationQueue.push(config);
      return;
    }

    this.playAnimation(config);
  }

  // Play animation
  private playAnimation(config: AnimationConfig): void {
    // Create animation container
    const container = document.createElement('div');
    container.className = 'fixed inset-0 pointer-events-none z-50 flex items-center justify-center';
    
    // Create animation element
    const animation = document.createElement('div');
    animation.className = 'relative';
    animation.style.cssText = `
      position: absolute;
      transition: all ${config.duration}ms cubic-bezier(0.4, 0, 0.2, 1);
      transform: scale(0) rotate(0deg);
      opacity: 0;
      z-index: 9999;
    `;

    // Create image element
    const img = document.createElement('img');
    img.src = config.image;
    img.alt = `Animation ${config.id}`;
    img.className = 'w-32 h-32 object-contain';
    img.style.cssText = `
      filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
      animation: glow 2s ease-in-out infinite alternate;
    `;

    // Position animation
    const position = this.getPosition(config.position);
    animation.style.left = position.left;
    animation.style.top = position.top;

    // Add image to animation
    animation.appendChild(img);
    container.appendChild(animation);
    document.body.appendChild(container);

    // Store reference
    this.currentAnimation = container;

    // Trigger animation
    setTimeout(() => {
      animation.style.transform = `scale(${config.scale}) rotate(${config.rotation}deg)`;
      animation.style.opacity = config.opacity.toString();
    }, 50);

    // Remove animation after duration
    setTimeout(() => {
      animation.style.transform = 'scale(0) rotate(0deg)';
      animation.style.opacity = '0';
      
      setTimeout(() => {
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
        this.currentAnimation = null;
        
        // Play next animation in queue
        if (this.animationQueue.length > 0) {
          const nextAnimation = this.animationQueue.shift();
          if (nextAnimation) {
            this.playAnimation(nextAnimation);
          }
        }
      }, 300);
    }, config.duration);
  }

  // Get position based on config
  private getPosition(position: string): { left: string; top: string } {
    switch (position) {
      case 'top-left':
        return { left: '10%', top: '10%' };
      case 'top-right':
        return { left: '70%', top: '10%' };
      case 'bottom-left':
        return { left: '10%', top: '70%' };
      case 'bottom-right':
        return { left: '70%', top: '70%' };
      default:
        return { left: '50%', top: '50%' };
    }
  }

  // Show success animation
  public showSuccessAnimation(): void {
    this.showAnimationById('K3'); // Diamond shine for success
  }

  // Show error animation
  public showErrorAnimation(): void {
    this.showAnimationById('K5'); // Electric spark for error
  }

  // Show swap animation
  public showSwapAnimation(): void {
    this.showAnimationById('K2'); // Coin flip for swap
  }

  // Show stake animation
  public showStakeAnimation(): void {
    this.showAnimationById('K1'); // Gold sparkle for stake
  }

  // Show send animation
  public showSendAnimation(): void {
    this.showAnimationById('K4'); // Fire burst for send
  }

  // Show buy animation
  public showBuyAnimation(): void {
    this.showAnimationById('K8'); // Golden explosion for buy
  }

  // Show celebration animation
  public showCelebrationAnimation(): void {
    this.showAnimationById('K6'); // Rainbow trail for celebration
  }

  // Show magic animation
  public showMagicAnimation(): void {
    this.showAnimationById('K7'); // Crystal glow for magic
  }
}

// Export singleton instance
export const animationManager = AnimationManager.getInstance();

// CSS for animations
export const ANIMATION_STYLES = `
  @keyframes glow {
    0% { filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5)); }
    100% { filter: drop-shadow(0 0 30px rgba(255, 215, 0, 1)); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }

  @keyframes fadeInUp {
    0% {
      opacity: 0;
      transform: translateY(30px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInDown {
    0% {
      opacity: 0;
      transform: translateY(-30px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    0% {
      opacity: 0;
      transform: translateX(-30px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    0% {
      opacity: 0;
      transform: translateX(30px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes zoomIn {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes zoomOut {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: scale(0.3);
    }
  }

  @keyframes flipInX {
    0% {
      transform: perspective(400px) rotateX(90deg);
      opacity: 0;
    }
    40% {
      transform: perspective(400px) rotateX(-20deg);
    }
    60% {
      transform: perspective(400px) rotateX(10deg);
    }
    80% {
      transform: perspective(400px) rotateX(-5deg);
    }
    100% {
      transform: perspective(400px) rotateX(0deg);
      opacity: 1;
    }
  }

  @keyframes flipInY {
    0% {
      transform: perspective(400px) rotateY(90deg);
      opacity: 0;
    }
    40% {
      transform: perspective(400px) rotateY(-20deg);
    }
    60% {
      transform: perspective(400px) rotateY(10deg);
    }
    80% {
      transform: perspective(400px) rotateY(-5deg);
    }
    100% {
      transform: perspective(400px) rotateY(0deg);
      opacity: 1;
    }
  }
`; 