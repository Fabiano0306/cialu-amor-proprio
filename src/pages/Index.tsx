import React, { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Star, Plus, Minus, X, Menu, Home, Grid3X3, Info, Phone, Instagram, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

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
    image: "https://images.unsplash.com/photo-1566479179817-99219c02d516?w=400&h=600&fit=crop",
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
    image: "https://images.unsplash.com/photo-1566479179817-99219c02d516?w=400&h=600&fit=crop",
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
  const { toast } = useToast();

  const addToCart = (product: Product, size: string, qty: number) => {
    const existingItem = cart.find(item => item.id === product.id && item.selectedSize === size);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id && item.selectedSize === size
          ? { ...item, quantity: item.quantity + qty }
          : item
      ));
    } else {
      setCart([...cart, { ...product, selectedSize: size, quantity: qty }]);
    }

    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao seu carrinho.`,
    });

    setSelectedProduct(null);
    setSelectedSize("");
    setQuantity(1);
  };

  const removeFromCart = (productId: number, size: string) => {
    setCart(cart.filter(item => !(item.id === productId && item.selectedSize === size)));
  };

  const updateQuantity = (productId: number, size: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId, size);
      return;
    }

    setCart(cart.map(item =>
      item.id === productId && item.selectedSize === size
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
    toast({
      title: "Carrinho limpo!",
      description: "Todos os itens foram removidos do seu carrinho.",
    });
  };

  const finalizePurchase = () => {
    if (cart.length === 0) return;

    const orderDetails = cart.map(item => 
      `${item.name} - Tamanho: ${item.selectedSize} - Quantidade: ${item.quantity} - Valor: R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`
    ).join('\n');

    const totalValue = getTotalPrice().toFixed(2).replace('.', ',');
    const message = `Olá! Gostaria de finalizar minha compra:\n\n${orderDetails}\n\n*Total: R$ ${totalValue}*`;
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
                className="h-12 w-auto"
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

      {/* Hero Section */}
      <section id="inicio" className="py-20">
        <div className="container mx-auto px-4 text-center">
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
            💖 Favoritos da Semana
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
      </section>

      {/* Sobre a CIALU */}
      <section id="sobre" className="py-5 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-playfair font-medium mb-12">
          Sobre a CIALU
        </h2>
        <div className="prose prose-lg mx-auto text-gray-700 font-inter leading-relaxed">
          <p className="text-lg md:text-xl mb-6">
            A CIALU nasceu para vestir o amor-próprio com elegância.
          </p>
          <p className="text-base md:text-lg mb-6">
            Somos uma loja pensada para mulheres que valorizam conforto, estilo e autenticidade. 
            Nossas peças são escolhidas com carinho, com foco em cortes que valorizam todos os corpos e criam experiências memoráveis.
          </p>
          <p className="text-base md:text-lg font-medium">
            Aqui, você não compra apenas roupas — você investe em si mesma.
          </p>
        </div>
          </div>
        </div>
        <div className="container mx-auto px-4">
          <hr className="my-12 border-gray-200" />
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
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
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
                                onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center border rounded"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-sm font-inter">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center border rounded"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id, item.selectedSize)}
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
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold font-inter">Total:</span>
                    <span className="text-xl font-bold font-inter">
                      R$ {getTotalPrice().toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-inter"
                      onClick={clearCart}
                    >
                      <Trash2 size={16} className="mr-2" />
                      Limpar carrinho
                    </Button>
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-inter"
                      onClick={finalizePurchase}
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
