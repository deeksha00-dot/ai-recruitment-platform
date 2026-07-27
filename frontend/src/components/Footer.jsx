export default function Footer() {
  return (
    <footer className="border-t border-slate-100 px-6 py-4 text-center text-xs text-slate-400 dark:border-white/5">
      © {new Date().getFullYear()} HireLens · AI Recruitment Platform. All rights reserved.
    </footer>
  );
}
