import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // 🔍 LOG 1: Verificar se o componente está montando
  useEffect(() => {
    console.log("🚀 ScrollToTopButton MONTADO!");
    console.log("📍 Posição inicial do scroll:", window.scrollY);
    return () => {
      console.log("💀 ScrollToTopButton DESMONTADO!");
    };
  }, []);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrollPosition = window.scrollY;
      const shouldBeVisible = scrollPosition > 250;
      
      // 🔍 LOG 2: Monitorar mudanças de scroll
      console.log("📜 Scroll detectado:", {
        posicao: scrollPosition,
        deveSerVisivel: shouldBeVisible,
        estadoAtual: isVisible
      });
      
      setIsVisible(shouldBeVisible);
    };

    // 🔍 LOG 3: Registrar listener
    console.log("👂 Listener de scroll REGISTRADO");
    window.addEventListener("scroll", toggleVisibility);
    
    // Chamar uma vez para verificar posição inicial
    toggleVisibility();
    
    return () => {
      console.log("🔇 Listener de scroll REMOVIDO");
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, [isVisible]);

  const scrollToTop = () => {
    console.log("⬆️ Botão clicado! Voltando ao topo...");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🔍 LOG 4: Verificar estado de renderização
  console.log("🎨 Renderizando ScrollToTopButton", {
    isVisible,
    classes: `fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300
      bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-cyan-500 hover:to-blue-600
      ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}
      focus:outline-none z-[9999]`
  });

  return (
    <button
      onClick={scrollToTop}
      title="Voltar ao topo"
      className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300
      bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-cyan-500 hover:to-blue-600
      ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}
      focus:outline-none z-[9999]`}
      style={{
        // 🔍 Forçar exibição temporária para debug
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid red' // Para visualizar facilmente
      }}
    >
      <ArrowUp size={22} />
    </button>
  );
}