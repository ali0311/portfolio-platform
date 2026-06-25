import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogIn, Menu, X } from "lucide-react";
import { navLinks } from "../constants/navigation";
import { useAuth } from "../context/AuthContext";
import { useActiveSection } from "../hooks/useActiveSection";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const sectionIds = useMemo(() => navLinks.map((l) => l.id), []);
  const onHome = location.pathname === "/";
  const activeSection = useActiveSection(onHome ? sectionIds : []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleNavClick = (e, link) => {
    if (!onHome) {
      e.preventDefault();
      navigate(`/${link.href}`);
    }
    setMobileOpen(false);
  };

  return (
    <>
      <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.inner}>
          <div className={styles.logo} aria-label="Home">
            <span className={styles.logoMark}>MK</span>
            <span>Md Ali Khan</span>
          </div>

          <nav className={styles.links} aria-label="Primary">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={onHome ? link.href : `/${link.href}`}
                className={`${styles.link} ${onHome && activeSection === link.id ? styles.active : ""
                  }`}
                onClick={(e) => handleNavClick(e, link)}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className={styles.actions}>
            {isAuthenticated ? (
              <Link to="/dashboard" className={styles.dashboardLink}>
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>
            ) : (
              <Link to="/login" className={styles.loginBtn}>
                <LogIn size={16} />
                <span>Author Login</span>
              </Link>
            )}
            <button
              type="button"
              className={styles.hamburger}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className={styles.mobileMenu} role="menu">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={onHome ? link.href : `/${link.href}`}
              className={`${styles.mobileLink} ${onHome && activeSection === link.id ? styles.active : ""
                }`}
              onClick={(e) => handleNavClick(e, link)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
