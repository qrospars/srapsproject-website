import React from 'react';
import logo from '../assets/images/logo sraps 3.svg';
import { Link } from 'react-router-dom';
interface SocialLinkProps {
  href: string;
  children: React.ReactNode;
}

const Instagram = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className='footer_icon' width="100%" height="100%" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const Bandcamp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className='footer_icon' width="100%" height="100%" viewBox="0 0 512 512"><path d="M256,8C119,8,8,119,8,256S119,504,256,504,504,393,504,256,393,8,256,8Zm48.2,326.1h-181L207.9,178h181Z" /></svg>
);

const Tiktok = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className='footer_icon' width="100%" height="100%" viewBox="0 0 16 16"> <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0Z" /> </svg>

);

const SocialLink = ({ href, children }: SocialLinkProps) => (
  <div role="listitem" className="social-link">
    <a href={href} target="_blank">{children}</a>

  </div>
);

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer__socials">
        <SocialLink href="https://www.instagram.com/sraps.music">
          <Instagram />
        </SocialLink>
        <SocialLink href="https://sraps.bandcamp.com/album/srapsproject001">
          <Bandcamp />
        </SocialLink>
        <SocialLink href="https://www.tiktok.com/@sraps.music">
          <Tiktok />
        </SocialLink>
      </div>
      <div className="footer__certification">
        <p>sraps.music © <span className="year">2023</span></p>
      </div>
    </div>
  );
}

export default Footer;
