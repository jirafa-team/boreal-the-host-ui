"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useValidateUserMutation } from "@/features/auth/slices/authSlice";
import { useLanguage } from "@/lib/i18n-context";
import { BorealLoadingBar } from "@/components/boreal-loading-bar";
import Image from "next/image";

type Status = "idle" | "loading" | "success" | "needsTerms" | "error";

function ValidateUserContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("t");
  const { t } = useLanguage();

  const [validateUser, { isLoading }] = useValidateUserMutation();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const doValidate = useCallback(
    async (withTerms = false) => {
      if (!token) return;
      setErrorMessage(null);
      try {
        const result = await validateUser({
          token,
          ...(withTerms && { termsAccepted: true }),
        }).unwrap();
        if (result.needsTermsAcceptance) {
          setStatus("needsTerms");
        } else {
          setStatus("success");
          setTimeout(() => router.push("/"), 2500);
        }
      } catch (err) {
        const e = err as { data?: { message?: string }; status?: number };
        setErrorMessage(e?.data?.message ?? t("validateEmail.error"));
        setStatus("error");
      }
    },
    [token, validateUser, t]
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage(t("validateEmail.invalidLink"));
      return;
    }
    if (status === "idle") {
      setStatus("loading");
      doValidate(false);
    }
  }, [token, status, doValidate, t]);

  const handleAcceptTerms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setErrorMessage(t("validateEmail.mustAcceptTerms"));
      return;
    }
    setErrorMessage(null);
    setStatus("loading");
    doValidate(true);
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-md w-full text-center space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">{t("validateEmail.title")}</h1>
          <p className="text-red-600">{t("validateEmail.invalidLink")}</p>
          <Button asChild className="w-full">
            <Link href="/">{t("validateEmail.backToLogin")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (status === "loading" || isLoading || (token && status === "idle")) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-12 flex flex-col items-center justify-center min-h-96 max-w-md w-full">
          <BorealLoadingBar />
          <p className="mt-4 text-muted-foreground">{t("validateEmail.verifying")}</p>
        </div>
      </div>
    );
  }

  if (status === "needsTerms") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="relative z-10 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center mb-4">
              <Image
                src="/images/thehost-20logo.png"
                alt="TheHost Logo"
                width={260}
                height={130}
                className="h-24 w-auto"
              />
            </div>
          </div>
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">{t("validateEmail.acceptTermsTitle")}</h1>
            <p className="text-gray-600">{t("validateEmail.acceptTermsDescription")}</p>
            {errorMessage && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{errorMessage}</p>
            )}
            <form onSubmit={handleAcceptTerms} className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">{t("validateEmail.acceptTermsLabel")}</span>
              </label>
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl"
                disabled={!termsAccepted}
              >
                {t("validateEmail.confirmAndActivate")}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-md w-full text-center space-y-6">
          <div className="text-green-600 text-5xl">✓</div>
          <h1 className="text-2xl font-bold text-gray-800">{t("validateEmail.successTitle")}</h1>
          <p className="text-gray-600">{t("validateEmail.success")}</p>
          <p className="text-sm text-muted-foreground">{t("validateEmail.redirecting")}</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-md w-full text-center space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">{t("validateEmail.title")}</h1>
          <p className="text-red-600">{errorMessage ?? t("validateEmail.error")}</p>
          <Button asChild className="w-full">
            <Link href="/">{t("validateEmail.backToLogin")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

export default function ValidateUserPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-12 flex flex-col items-center justify-center min-h-96 max-w-md w-full">
            <BorealLoadingBar />
          </div>
        </div>
      }
    >
      <ValidateUserContent />
    </Suspense>
  );
}
