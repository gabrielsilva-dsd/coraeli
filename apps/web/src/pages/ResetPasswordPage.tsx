import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { supabase } from "../lib/supabase";
import "./AuthPage.css";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (password.length < 8) {
      setErrorMessage("Sua nova senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirmation) {
      setErrorMessage("As duas senhas precisam ser iguais.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setErrorMessage("O link pode ter expirado. Solicite uma nova recuperação.");
      setIsSubmitting(false);
      return;
    }

    navigate("/criar", { replace: true });
  }

  return (
    <main className="auth-page auth-page--reset">
      <Link className="auth-brand" to="/">
        <span aria-hidden="true">C</span>
        <strong>Coraeli</strong>
      </Link>

      <section className="auth-card auth-card--reset">
        <div className="auth-card__heading">
          <span>Proteja sua conta</span>
          <h1>Crie uma nova senha</h1>
          <p>Escolha uma senha que você ainda não utiliza em outros sites.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Nova senha
            <input
              required
              minLength={8}
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <label>
            Confirmar nova senha
            <input
              required
              minLength={8}
              type="password"
              autoComplete="new-password"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
            />
          </label>

          {errorMessage && (
            <p className="auth-feedback auth-feedback--error" role="alert">
              {errorMessage}
            </p>
          )}

          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar nova senha"}
            <span aria-hidden="true">→</span>
          </button>
        </form>
      </section>
    </main>
  );
}
