import { AiFillInstagram, AiFillFacebook, AiOutlineWhatsApp } from "react-icons/ai";
import { SiTiktok } from "react-icons/si";

export const Footer = () => {
  return (
    <footer className="footer-container flex flex-col items-center justify-center gap-2 py-6 text-center text-sm text-gray-600 bg-gray-100">
      <p className="font-medium">© 2025 CYE Tech Store. Todos los derechos reservados.</p>
      <div className="flex gap-4 text-2xl text-gray-700">
        <a href="https://www.instagram.com/cyetech/profilecard/?igsh=enl0ZmNjbmE5czk3" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <AiFillInstagram className="hover:text-pink-500 transition-colors" />
        </a>
        <a href="https://www.facebook.com/share/16efa9JMz1/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <AiFillFacebook className="hover:text-blue-600 transition-colors" />
        </a>
        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
          <SiTiktok className="hover:text-black transition-colors" />
        </a>
        <a href="https://wa.me/5493512196753" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
          <AiOutlineWhatsApp className="hover:text-green-600 transition-colors" />
        </a>
      </div>
    </footer>
  );
};
