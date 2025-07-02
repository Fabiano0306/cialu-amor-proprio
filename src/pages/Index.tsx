import React, { useState, useEffect } from 'react';
import {
  ShoppingBag, Heart, Star, Plus, Minus, X, Menu, Home,
  Grid3X3, Info, Phone, Instagram, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { set } from 'date-fns';
import { toast } from "sonner";


interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  sizes: string[];
  featured?: boolean;
  badge?: string;
}

interface CartItem extends Product {
  selectedSize: string;
  quantity: number;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Vestido Elegante Preto",
    price: 299.90,
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=600&fit=crop",
    description: "Vestido elegante perfeito para ocasiões especiais",
    sizes: ["PP", "P", "M", "G", "GG", "XG"],
    featured: true,
    badge: "✨ Mais Amado"
  },
  {
    id: 2,
    name: "Blusa Sofisticada Branca",
    price: 189.90,
    image: "https://images.unsplash.com/photo-1551803091-e20673f15770?w=400&h=600&fit=crop",
    description: "Blusa branca com corte moderno e elegante",
    sizes: ["PP", "P", "M", "G", "GG", "XG"],
    featured: true,
    badge: "💎 Edição Limitada"
  },
  {
    id: 3,
    name: "Saia Midi Preta",
    price: 159.90,
    image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=600&fit=crop",
    description: "Saia midi com design clássico e atemporal",
    sizes: ["PP", "P", "M", "G", "GG", "XG"],
    featured: true,
    badge: "✨ Mais Amado"
  },
  {
    id: 4,
    name: "Conjunto Social Feminino",
    price: 449.90,
    image: "https://images.unsplash.com/photo-1551803091-e20673f15770?w=400&h=600&fit=crop",
    description: "Conjunto completo para look profissional",
    sizes: ["PP", "P", "M", "G", "GG", "XG"],
    featured: true,
    badge: "💎 Edição Limitada"
  },
  {
    id: 5,
    name: "Vestido Longo Branco",
    price: 349.90,
    image: "https://images.unsplash.com/photo-1551803091-e20673f15770?w=400&h=600&fit=crop",
    description: "Vestido longo ideal para eventos especiais",
    sizes: ["PP", "P", "M", "G", "GG", "XG"]
  },
  {
    id: 6,
    name: "Blazer Feminino Premium",
    price: 279.90,
    image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=600&fit=crop",
    description: "Blazer de alta qualidade com acabamento impecável",
    sizes: ["PP", "P", "M", "G", "GG", "XG"]
  },
  {
    id: 7,
    name: "Calça Social Preta",
    price: 219.90,
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=600&fit=crop",
    description: "Calça social com modelagem perfeita",
    sizes: ["PP", "P", "M", "G", "GG", "XG"]
  },
  {
    id: 8,
    name: "Top Elegante",
    price: 129.90,
    image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=600&fit=crop",
    description: "Top com design moderno e sofisticado",
    sizes: ["PP", "P", "M", "G", "GG", "XG"]
  }
];

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [cep, setCep] = useState("");
  const [cepInfo, setCepInfo] = useState<{ uf: string; localidade: string } | null>(null);
  const [frete, setFrete] = useState(0);
  
  // controle de Entrega vs Retirada
const [tipoEntrega, setTipoEntrega] = useState<"entrega" | "retirada" | "">("");


  // Função para adicionar produto ao carrinho
  const addToCart = (product: Product, size: string, quantity: number) => {
    if (!size) {
      toast.error("Selecione um tamanho", {
        description: "Escolha o tamanho antes de adicionar ao carrinho."
      });
      return;
    }
    const existingIndex = cart.findIndex(
      (item) => item.id === product.id && item.selectedSize === size
    );
    if (existingIndex !== -1) {
      // Atualiza a quantidade se já existir
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          ...product,
          selectedSize: size,
          quantity,
        },
      ]);
    }
    setSelectedProduct(null);
    setSelectedSize("");
    setQuantity(1);
    // ✅ Toast do Sonner com duração controlada
toast.success("Adicionado ao carrinho", {
  description: `${product.name} (${size})`,
  duration: 3000
});




  };

  const [enderecoCompleto, setEnderecoCompleto] = useState("");

  // Quando selecionar "Retirada em loja", zera os dados de entrega
useEffect(() => {
  if (tipoEntrega === "retirada") {
    setFrete(0);
    setCep("");
    setCepInfo(null);
    setEnderecoCompleto("");
  }
}, [tipoEntrega]);

  const calcularFrete = async () => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) {
      toast("CEP inválido. Digite um CEP com 8 dígitos.");
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast("CEP não encontrado. Verifique o CEP digitado.");
        return;
      }

      setCepInfo({ uf: data.uf, localidade: data.localidade });

      switch (data.uf.toLowerCase()) {
        case "sp": setFrete(25); break;
        case "rj": setFrete(40); break;
        case "mg": setFrete(20); break;
        case "pr": setFrete(48); break;
        case "rs": setFrete(57); break;
        case "sc": setFrete(60); break;
        default: setFrete(22);
      }

      toast(`Frete calculado: Local - ${data.localidade} - ${data.uf}`);
    } catch (error) {
      toast("Erro ao buscar CEP. Tente novamente mais tarde.");
    }
  };

  const getTotalPrice = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const getTotalWithFrete = () => {
  return tipoEntrega === "entrega" ? getTotalPrice() + frete : getTotalPrice();
};

  const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);

 const finalizePurchase = () => {
  if (cart.length === 0) return;
  // só exige CEP se for entrega
  if (tipoEntrega === "entrega" && !cepInfo) return;

  const produtos = cart.map(item =>
    `- ${item.name}\n*Tamanho:* ${item.selectedSize} \n*Quantidade:* ${item.quantity} \n*Valor:* R$${(item.price * item.quantity).toFixed(2).replace('.', ',')}`
  ).join('\n\n');

  const freteTexto = tipoEntrega === "entrega"
  ? `\n*CEP:* ${cep}\n*Local:* ${cepInfo?.localidade} - ${cepInfo?.uf}\n*Endereço completo:* ${enderecoCompleto || "Não informado"}\n*Valor do Frete:* R$${frete.toFixed(2).replace('.', ',')}\n`
  : "\n*Opção:* Retirar em loja\n";


  const total = getTotalWithFrete().toFixed(2).replace('.', ',');

  const totalTexto = tipoEntrega === "entrega"
  ? `*Valor total com frete:* R$${total}`
  : `*Valor total:* R$${total}`;

const message = `Olá! Gostaria de finalizar minha compra:\n\n*Produtos:*\n${produtos}\n---------------------------------${freteTexto}\n---------------------------------\n${totalTexto}`;


  const whatsappUrl = `https://wa.me/5547996224032?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
};

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const featuredProducts = mockProducts.filter(product => product.featured);

  useEffect(() => {
    document.title = "CIALU | Moda Feminina Elegante & Sofisticada – Vista Amor Próprio";
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-inter">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img 
              src="/lovable-uploads/logo.png" 
              alt="CIALU - Moda Feminina Elegante" 
              className="h-20 w-auto"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('inicio')} className="flex items-center space-x-1 hover:text-gray-600 transition-colors">
                <Home size={16} />
                <span>Início</span>
              </button>
              <button onClick={() => scrollToSection('colecoes')} className="flex items-center space-x-1 hover:text-gray-600 transition-colors">
                <Grid3X3 size={16} />
                <span>Coleções</span>
              </button>
              <button onClick={() => scrollToSection('sobre')} className="flex items-center space-x-1 hover:text-gray-600 transition-colors">
                <Info size={16} />
                <span>Sobre a CIALU</span>
              </button>
              <button onClick={() => scrollToSection('contato')} className="flex items-center space-x-1 hover:text-gray-600 transition-colors">
                <Phone size={16} />
                <span>Contato</span>
              </button>
            </nav>

            {/* Cart and Mobile Menu */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="relative hover:bg-gray-50"
                aria-label="Abrir carrinho de compras"
              >
                <ShoppingBag size={20} />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-black text-white text-xs min-w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Abrir menu"
              >
                <Menu size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="flex justify-between items-center p-4 border-b">
            <img 
              src="/lovable-uploads/logo.png" 
              alt="CIALU" 
              className="h-8 w-auto"
            />
            <Button variant="ghost" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={24} />
            </Button>
          </div>
          <nav className="p-4 space-y-4">
            <button onClick={() => scrollToSection('inicio')} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded w-full text-left">
              <Home size={16} />
              <span>Início</span>  
            </button>
            <button onClick={() => scrollToSection('colecoes')} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded w-full text-left">
              <Grid3X3 size={16} />
              <span>Coleções</span>
            </button>
            <button onClick={() => scrollToSection('sobre')} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded w-full text-left">
              <Info size={16} />
              <span>Sobre a CIALU</span>
            </button>
            <button onClick={() => scrollToSection('contato')} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded w-full text-left">
              <Phone size={16} />
              <span>Contato</span>
            </button>
          </nav>
        </div>
      )}

{/* Fundo animado com círculos flutuantes preto e branco (minimalista, fixo no topo da página) */}
<div
  className="pointer-events-none absolute top-0 left-0 w-full h-[420px] md:h-[520px] z-0 overflow-hidden"
  style={{
    position: "absolute",
    // Gradiente para fade-out na parte de baixo
    maskImage:
      "linear-gradient(to bottom, black 80%, transparent 100%)",
    WebkitMaskImage:
      "linear-gradient(to bottom, black 80%, transparent 100%)",
  }}
>
  {[...Array(10)].map((_, i) => {
    // Propriedades aleatórias para cada sparkle
    const left = Math.random() * 100;
    const size = 10 + Math.random() * 16;
    const duration = 8 + Math.random() * 10;
    const delay = Math.random() * 10;
    const opacity = 0.18 + Math.random() * 0.22;
    const top = Math.random() * 40;
    const isBlack = Math.random() > 0.5;
    const rotate = Math.random() * 360;

    return (
      <div
        key={i}
        className="absolute"
        style={{
          left: `${left}%`,
          top: `${top}%`,
          width: `${size}px`,
          height: `${size}px`,
          opacity,
          animation: `floatSparkle${i} ${duration}s linear infinite`,
          animationDelay: `${delay}s`,
          pointerEvents: "none",
          transform: `rotate(${rotate}deg)`,
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 20 20"
          fill="none"
          style={{
            display: "block",
            filter: isBlack
              ? "drop-shadow(0 0 6px #0008)"
              : "drop-shadow(0 0 6px #fff8)",
          }}
        >
          <g>
            <polygon
              points="10,1 12,8 19,10 12,12 10,19 8,12 1,10 8,8"
              fill={isBlack ? "#111" : "#fff"}
              stroke={isBlack ? "#fff" : "#111"}
              strokeWidth="1.2"
              opacity="0.95"
            />
          </g>
        </svg>
      </div>
    );
  })}
  <style>
    {`
      ${[...Array(10)].map((_, i) => {
        const sway = 10 + Math.random() * 24;
        return `
          @keyframes floatSparkle${i} {
            0% {
              transform: translateY(0px) translateX(0px) scale(1) rotate(0deg);
              opacity: 0.7;
            }
            50% {
              transform: translateY(180px) translateX(${sway}px) scale(1.08) rotate(20deg);
              opacity: 0.95;
            }
            100% {
              transform: translateY(420px) translateX(${-sway}px) scale(1.13) rotate(0deg);
              opacity: 0;
            }
          }
        `;
      }).join('\n')}
    `}
  </style>
</div>

      {/* Hero Section */}
      <section id="inicio" className="py-20 relative">
  <div className="container mx-auto px-4 text-center relative z-10">
    <img
      src="/lovable-uploads/logo.png"
      alt="CIALU - Moda Feminina"
      className="mx-auto"
      style={{ maxHeight: 420 }}
    />
  </div>
</section>

      {/* Seção de Efeito */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-playfair font-medium mb-8 text-black">
              Nossa Essência
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-inter">
              Buscamos trazer elegância e sofisticação! Para você, nosso cliente, queremos que se sinta bem fazendo suas compras e esperamos trazer toda experiência de uma boa compra conosco.
            </p>
          </div>
        </div>
      </section>

      {/* Favoritos da Semana */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-playfair font-medium text-center mb-12">
             Favoritos da Semana
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer animate-fade-in"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.badge && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                      {product.badge}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <h3 className="font-medium mb-2 text-sm md:text-base font-inter">{product.name}</h3>
                <p className="text-gray-600 text-xs md:text-sm mb-2 font-inter">{product.description}</p>
                <p className="font-semibold text-lg font-inter">R$ {product.price.toFixed(2).replace('.', ',')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="colecoes" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-playfair font-medium text-center mb-12">Nossa Coleção</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {mockProducts.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer animate-fade-in"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <h3 className="font-medium mb-2 text-sm md:text-base font-inter">{product.name}</h3>
                <p className="text-gray-600 text-xs md:text-sm mb-2 font-inter">{product.description}</p>
                <p className="font-semibold text-lg font-inter">R$ {product.price.toFixed(2).replace('.', ',')}</p>
              </div>
            ))}
          </div>
        </div>
         <div className="container mx-auto px-4">
          <hr className="my-16 border-gray-200" />
        </div>
      </section>

      {/* Sobre a CIALU */}
      <section
        id="sobre"
        className="relative py-20 bg-gradient-to-b from-white via-gray-50 to-gray-100 overflow-hidden"
      >
        {/* Ornamental SVG background (tons de cinza) */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1440 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-0 left-0 w-full h-40 opacity-30"
          >
            <path
              fill="#e5e7eb"
              d="M0,160L60,154.7C120,149,240,139,360,154.7C480,171,600,213,720,218.7C840,224,960,192,1080,186.7C1200,181,1320,203,1380,213.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-8 text-black tracking-tight drop-shadow-sm">
              Sobre a <span className="text-black">CIALU</span>
            </h2>
            <div className="mx-auto text-gray-800 font-inter leading-relaxed text-lg md:text-xl">
              <p className="mb-6 italic text-black text-2xl font-light">
                A CIALU nasceu para vestir o amor próprio com elegância.
              </p>
              <p className="mb-6 text-base md:text-lg text-black">
                Somos uma loja pensada para mulheres que valorizam <span className="font-semibold text-black">conforto</span>, <span className="font-semibold text-black">estilo</span> e <span className="font-semibold text-black">autenticidade</span>.
                Nossas peças são escolhidas com carinho, com foco em cortes que valorizam todos os corpos e criam experiências memoráveis.
              </p>
              <p className="text-lg md:text-xl font-semibold text-black">
                Aqui, você não compra apenas roupas, você investe em si mesma.
              </p>
            </div>
            
          </div>
        </div>
        <div className="container mx-auto px-4">
          <hr className="my-16 border-gray-200" />
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold font-playfair">{selectedProduct.name}</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedProduct(null)}>
                  <X size={20} />
                </Button>
              </div>

              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full aspect-[3/4] object-cover rounded-lg mb-4"
              />

              <p className="text-gray-600 mb-4 font-inter">{selectedProduct.description}</p>
              <p className="text-2xl font-semibold mb-6 font-inter">
                R$ {selectedProduct.price.toFixed(2).replace('.', ',')}
              </p>

              {/* Size Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3 font-inter">Tamanho</label>
                <div className="grid grid-cols-3 gap-2">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-4 border rounded-md text-sm transition-colors font-inter ${
                        selectedSize === size
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3 font-inter">Quantidade</label>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="w-12 text-center font-inter">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              <Button
                className="w-full bg-black hover:bg-gray-800 text-white font-inter"
                onClick={() => addToCart(selectedProduct, selectedSize, quantity)}
                disabled={!selectedSize}
              >
                Adicionar ao Carrinho
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
  <div
    className="fixed inset-0 z-50 bg-black/50"
    onClick={() => setIsCartOpen(false)} // fechar ao clicar fora
  >
    <div
      className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
      onClick={(e) => e.stopPropagation()} // impedir fechamento ao clicar dentro
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold font-playfair">Carrinho de Compras</h3>
          <Button variant="ghost" size="sm" onClick={() => setIsCartOpen(false)}>
            <X size={20} />
          </Button>
        </div>


              <div className="flex-1 overflow-y-auto p-4">
  {cart.length === 0 ? (
    <div className="text-center py-8">
      <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
      <p className="text-gray-500 font-inter">Seu carrinho está vazio</p>
    </div>
  ) : (
    <div className="space-y-4">
      {cart.map((item) => (
        <div key={`${item.id}-${item.selectedSize}`} className="flex space-x-3 border-b pb-4">
          <img
            src={item.image}
            alt={item.name}
            className="w-16 h-20 object-cover rounded"
          />
          <div className="flex-1">
            <h4 className="font-medium text-sm font-inter">{item.name}</h4>
            <p className="text-xs text-gray-600 mb-1 font-inter">{item.description}</p>
            <p className="text-xs text-gray-600 mb-2 font-inter">Tamanho: {item.selectedSize}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const newQty = item.quantity - 1;
                    if (newQty > 0) {
                      setCart(cart.map(ci => ci.id === item.id && ci.selectedSize === item.selectedSize
                        ? { ...ci, quantity: newQty }
                        : ci
                      ));
                    } else {
                      setCart(cart.filter(ci => !(ci.id === item.id && ci.selectedSize === item.selectedSize)));
                    }
                  }}
                  className="w-6 h-6 flex items-center justify-center border rounded"
                >
                  <Minus size={12} />
                </button>
                <span className="text-sm font-inter">{item.quantity}</span>
                <button
                  onClick={() => {
                    setCart(cart.map(ci => ci.id === item.id && ci.selectedSize === item.selectedSize
                      ? { ...ci, quantity: item.quantity + 1 }
                      : ci
                    ));
                  }}
                  className="w-6 h-6 flex items-center justify-center border rounded"
                >
                  <Plus size={12} />
                </button>
              </div>
              <button
                onClick={() => setCart(cart.filter(ci => !(ci.id === item.id && ci.selectedSize === item.selectedSize)))}
                className="text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-sm font-semibold mt-2 font-inter">
              R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
            </p>
          </div>
        </div>
      ))}
    </div>
  )}
</div>


              {cart.length > 0 && (
  <div className="border-t p-4">

    {/* Tipo de Entrega */}
    <div className="mb-4">
      <label className="block text-sm font-medium font-inter mb-2">
        Como você prefere receber?
      </label>
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="tipoEntrega"
            value="entrega"
            checked={tipoEntrega === "entrega"}
            onChange={() => setTipoEntrega("entrega")}
          />
          Entrega
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="tipoEntrega"
            value="retirada"
            checked={tipoEntrega === "retirada"}
            onChange={() => setTipoEntrega("retirada")}
          />
          Retirar em loja
        </label>
      </div>
    </div>

    {/* Campos de CEP e Endereço só se for entrega */}
    {tipoEntrega === "entrega" && (
      <>
        <div className="mb-4 space-y-2">
          <label className="block text-sm font-medium font-inter">CEP</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Digite o CEP"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <Button onClick={calcularFrete}>Calcular</Button>
          </div>
          {cepInfo && (
            <p className="text-xs text-gray-600">
              Destino: {cepInfo.localidade} – {cepInfo.uf}
            </p>
          )}
        </div>

        <div className="space-y-2 mt-4">
          <label className="block text-sm font-medium font-inter">
            Endereço completo (Rua/Avenida e número)
          </label>
          <input
            type="text"
            placeholder="Ex: Rua das Flores, 123"
            value={enderecoCompleto}
            onChange={(e) => setEnderecoCompleto(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
      </>
    )}


                  


                  {/* Totais */}
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium font-inter">Subtotal:</span>
                    <span className="text-sm font-inter">
                      R$ {getTotalPrice().toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium font-inter">Frete:</span>
                    <span className="text-sm font-inter">
                      R$ {frete.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold font-inter">Total:</span>
                    <span className="text-xl font-bold font-inter">
                      R$ {getTotalWithFrete().toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-inter"
                      onClick={() => setCart([])}
                    >
                      <Trash2 size={16} className="mr-2" />
                      Limpar carrinho
                    </Button>
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-inter"
                      onClick={finalizePurchase}
                      disabled={
  (tipoEntrega === "entrega" && !cepInfo) || tipoEntrega === ""}
                    >
                      Finalizar Compra
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer id="contato" className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 items-center text-center md:text-left">

            

            {/* Contact Section */}
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold mb-6 font-playfair text-gray-800">Contato</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-center md:justify-start space-x-3">
                  
                  <div className="flex gap-4 mb-8">
                    <a
                      href="https://wa.me/5547996224032"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-full transition-colors text-sm font-medium shadow-sm hover:shadow-md transform hover:scale-105 duration-200"
                    >
                      <Phone size={16} />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href="https://instagram.com/cialu_amorproprio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2.5 rounded-full transition-all text-sm font-medium shadow-sm hover:shadow-md transform hover:scale-105 duration-200"
                    >
                      <Instagram size={16} />
                      <span>Instagram</span>
                    </a>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 font-medium mb-2">Horário de Atendimento</p>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>Segunda a Sexta: 9h às 18h</p>
                    <p>Sábado: 9h às 14h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Logo centralizada */}
  <div>
    <img
      src="/lovable-uploads/logo.png"
      alt="CIALU - Moda Feminina"
      className="mx-auto"
      style={{ maxHeight: 250 }}
    />
  </div>

  {/* Menu à direita */}
  <div className="text-center md:text-right">
    <h3 className="text-xl font-semibold mb-6 font-playfair text-gray-800">Menu</h3>
    <div className="space-y-3 text-sm text-gray-600 flex flex-col items-center md:items-end text-right">
      <button onClick={() => scrollToSection('inicio')} className="hover:text-gray-800 transition-colors">Início</button>
      <button onClick={() => scrollToSection('colecoes')} className="hover:text-gray-800 transition-colors">Coleções</button>
      <button onClick={() => scrollToSection('sobre')} className="hover:text-gray-800 transition-colors">Sobre</button>
      <button onClick={() => scrollToSection('contato')} className="hover:text-gray-800 transition-colors">Contato</button>
    </div>
  </div>
</div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-center md:text-left text-gray-500 text-sm">
                <p className="font-medium">&copy; 2025 CIALU. Todos os direitos reservados.</p>
                <p className="mt-1 font-light">Desenvolvido com ❤️ para mulheres que valorizam sua elegância</p>
              </div>
              
              <div className="text-center md:text-right">
                <a
                  href="https://instagram.com/desenvolvedor_fabiano"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors text-sm font-medium hover:underline decoration-2 underline-offset-2"
                >
                  <Instagram size={16} />
                  <span>Fabiano Santos</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
