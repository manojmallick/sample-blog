import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, NavLink, Route, Routes } from "react-router-dom";
import { api, applyAccent, type PageSummary, type Settings } from "./api";
import { LOCALE_NAMES, LocaleProvider, useLocale } from "./i18n";
import { AdminPage } from "./pages/Admin";
import { HomePage } from "./pages/Home";
import { PageView } from "./pages/PageView";
import { PostPage } from "./pages/PostPage";
import { PostList } from "./pages/PostList";
import "./styles.css";

function Shell() {
  const { locale, setLocale, t } = useLocale();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [pages, setPages] = useState<PageSummary[]>([]);

  const refreshChrome = () => {
    api
      .settings()
      .then((s) => {
        setSettings(s);
        applyAccent(s.accentColor);
        document.title = s.siteTitle;
      })
      .catch(() => {});
    api
      .pages()
      .then((p) => setPages(p.filter((page) => page.showInNav)))
      .catch(() => {});
  };

  useEffect(refreshChrome, []);

  const locales = settings?.locales ?? ["en"];

  return (
    <BrowserRouter>
      <header className="site">
        <div className="inner">
          <Link to="/" className="title">
            {settings?.siteTitle ?? "…"}
            <span> ✦</span>
          </Link>
          <nav className="pages">
            <NavLink to="/blog" className={({ isActive }) => (isActive ? "active" : "")}>
              {t("blog")}
            </NavLink>
            {pages.map((page) => (
              <NavLink
                key={page.id}
                to={`/p/${page.slug}`}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {page.title}
              </NavLink>
            ))}
            {locales.length > 1 && (
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                style={{ width: "auto", padding: "0.3rem 0.5rem", fontSize: "0.85rem" }}
                aria-label="Language"
              >
                {locales.map((code) => (
                  <option key={code} value={code}>
                    {LOCALE_NAMES[code] ?? code.toUpperCase()}
                  </option>
                ))}
              </select>
            )}
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<PostList />} />
        <Route path="/post/:slug" element={<PostPage />} />
        <Route path="/p/:slug" element={<PageView />} />
        <Route path="/admin" element={<AdminPage onChromeChange={refreshChrome} />} />
        <Route
          path="*"
          element={
            <main className="container notfound">
              <p className="code">404</p>
              <h1>{t("notFound")}</h1>
              <p className="muted">{t("notFoundHint")}</p>
              <p>
                <Link to="/">{t("home")} →</Link>
              </p>
            </main>
          }
        />
      </Routes>

      <footer className="site">
        <div className="inner">
          <div>
            <h4>{settings?.siteTitle}</h4>
            <p className="fineprint">{settings?.tagline}</p>
            <p className="fineprint">{settings?.footerText}</p>
          </div>
          <div>
            <h4>{t("blog")}</h4>
            <Link to="/blog">{t("allPosts")}</Link>
            {pages.map((page) => (
              <Link key={page.id} to={`/p/${page.slug}`}>
                {page.title}
              </Link>
            ))}
          </div>
          <div>
            <h4>Meta</h4>
            <Link to="/admin">{t("admin")}</Link>
            <a href="/feed.xml">RSS</a>
            <a href="/sitemap.xml">Sitemap</a>
          </div>
        </div>
      </footer>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LocaleProvider>
      <Shell />
    </LocaleProvider>
  </StrictMode>,
);
