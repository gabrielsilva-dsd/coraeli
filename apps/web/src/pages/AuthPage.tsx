import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import "./AuthPage.css";

type AuthMode = "signin" | "signup";
type LocationState = { from?: { pathname?: string } } | null;

function translateAuthError(message: string) {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("invalid login credentials")) {
    return "E-mail ou senha incorretos. Confira os dados e tente novamente.";
  }
  if (normalizedMessage.includes("email not confirmed")) {
    return "Confirme seu e-mail antes de entrar.";
  }
  if (normalizedMessage.includes("user already registered")) {
    return "Este e-mail já possui uma conta. Tente entrar.";
  }
  if (normalizedMessage.includes("password should be")) {
    return "Sua senha precisa ter pelo menos 8 caracteres.";
  }
  if (normalizedMessage.includes("rate limit")) {
    return "Muitas tentativas em pouco tempo. Aguarde um momento e tente novamente.";
  }

  return "Não conseguimos concluir agora. Tente novamente em instantes.";
}

function getSafeReturnPath(state: LocationState) {
  const savedPath = window.sessionStorage.getItem("coraeli:auth-return-to");
  const requestedPath = state?.from?.pathname ?? savedPath ?? "/criar";
  return requestedPath.startsWith("/") && !requestedPath.startsWith("//")
    ? requestedPath
    : "/criar";
}

export function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const returnPath = getSafeReturnPath(location.state as LocationState);

  useEffect(() => {
    if (!isLoading && user) {
      window.sessionStorage.removeItem("coraeli:auth-return-to");
      navigate(returnPath, { replace: true });
    }
  }, [isLoading, navigate, returnPath, user]);

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setFeedback(null);
  }

  async function handleGoogleSignIn() {
    setFeedback(null);
    setIsSubmitting(true);
    window.sessionStorage.setItem("coraeli:auth-return-to", returnPath);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/criar`,
      },
    });

    if (error) {
      setFeedback({ type: "error", message: translateAuthError(error.message) });
      setIsSubmitting(false);
    }
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    if (password.length < 8) {
      setFeedback({
        type: "error",
        message: "Crie uma senha com pelo menos 8 caracteres.",
      });
      return;
    }

    setIsSubmitting(true);

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: name.trim() },
          emailRedirectTo: `${window.location.origin}/criar`,
        },
      });

      if (error) {
        setFeedback({ type: "error", message: translateAuthError(error.message) });
      } else if (data.session) {
        navigate(returnPath, { replace: true });
      } else {
        setFeedback({
          type: "success",
          message: "Conta criada! Enviamos um link de confirmação para o seu e-mail.",
        });
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setFeedback({ type: "error", message: translateAuthError(error.message) });
      } else {
        navigate(returnPath, { replace: true });
      }
    }

    setIsSubmitting(false);
  }

  async function handlePasswordReset() {
    setFeedback(null);

    if (!email.trim()) {
      setFeedback({
        type: "error",
        message: "Digite seu e-mail primeiro para receber o link de recuperação.",
      });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });

    setFeedback(
      error
        ? { type: "error", message: translateAuthError(error.message) }
        : {
            type: "success",
            message: "Se este e-mail estiver cadastrado, você receberá um link para criar uma nova senha.",
          },
    );
    setIsSubmitting(false);
  }

  return (
    <main className="auth-page">
      <Link className="auth-brand" to="/" aria-label="Voltar para a página inicial">
        <span aria-hidden="true">C</span>
        <strong>Coraeli</strong>
      </Link>

      <section className="auth-shell">
        <div className="auth-story" aria-hidden="true">
          <span className="auth-story__eyebrow">Seu espaço na Coraeli</span>
          <h1>Histórias importantes merecem um lugar seguro.</h1>
          <p>
            Guarde seus presentes, continue quando quiser e publique somente
            quando cada detalhe estiver do seu jeito.
          </p>

          <div className="auth-story__card">
            <span>♡</span>
            <div>
              <small>Rascunho protegido</small>
              <strong>Continue de onde parou</strong>
            </div>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card__heading">
            <span>{mode === "signin" ? "Que bom ter você de volta" : "Comece sua história"}</span>
            <h2>{mode === "signin" ? "Entre na sua conta" : "Crie sua conta"}</h2>
            <p>
              {mode === "signin"
                ? "Acesse seus presentes e continue criando."
                : "Leva menos de um minuto e você não perde seu progresso."}
            </p>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Acesso à conta">
            <button
              className={mode === "signin" ? "is-active" : ""}
              type="button"
              role="tab"
              aria-selected={mode === "signin"}
              onClick={() => changeMode("signin")}
            >
              Entrar
            </button>
            <button
              className={mode === "signup" ? "is-active" : ""}
              type="button"
              role="tab"
              aria-selected={mode === "signup"}
              onClick={() => changeMode("signup")}
            >
              Criar conta
            </button>
          </div>

          <button
            className="auth-google"
            type="button"
            disabled={isSubmitting}
            onClick={handleGoogleSignIn}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285f4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.6h3.3c1.9-1.8 2.9-4.4 2.9-7.5Z" />
              <path fill="#34a853" d="M12 22c2.7 0 5-.9 6.7-2.3l-3.3-2.6c-.9.6-2.1 1-3.4 1a5.9 5.9 0 0 1-5.5-4.1H3.1v2.7A10 10 0 0 0 12 22Z" />
              <path fill="#fbbc05" d="M6.5 14a6 6 0 0 1 0-3.9V7.4H3.1a10 10 0 0 0 0 9.3L6.5 14Z" />
              <path fill="#ea4335" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.8A9.7 9.7 0 0 0 3.1 7.4l3.4 2.7A5.9 5.9 0 0 1 12 5.9Z" />
            </svg>
            Continuar com Google
          </button>

          <div className="auth-divider"><span>ou continue com e-mail</span></div>

          <form className="auth-form" onSubmit={handleEmailSubmit}>
            {mode === "signup" && (
              <label>
                Seu nome
                <input
                  required
                  maxLength={60}
                  autoComplete="name"
                  value={name}
                  placeholder="Como podemos chamar você?"
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
            )}

            <label>
              E-mail
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                placeholder="voce@exemplo.com"
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label>
              <span className="auth-form__password-label">
                Senha
                {mode === "signin" && (
                  <button type="button" onClick={handlePasswordReset}>
                    Esqueci minha senha
                  </button>
                )}
              </span>
              <input
                required
                minLength={8}
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                placeholder="No mínimo 8 caracteres"
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>

            {feedback && (
              <p className={`auth-feedback auth-feedback--${feedback.type}`} role="status">
                {feedback.message}
              </p>
            )}

            <button className="auth-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Só um instante..."
                : mode === "signin"
                  ? "Entrar na minha conta"
                  : "Criar minha conta"}
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <small className="auth-terms">
            Ao continuar, você concorda com os termos e a política de privacidade da Coraeli.
          </small>
        </div>
      </section>
    </main>
  );
}
