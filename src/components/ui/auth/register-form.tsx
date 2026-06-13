'use client'

import { type FocusEvent, useCallback, useMemo, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { createPortal } from 'react-dom'
import { Controller, useForm, useWatch, type Path } from 'react-hook-form'

import { motion } from 'motion/react'


import { cn } from '@/lib/cn'

import { useIsClient } from '@/hooks/use-is-client'

import { Icon } from '@/components/icon/index'

import { Button } from '@/components/internal/button'

const createSchemas = (_t: (key: string) => string) => ({
  REGISTER: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string(),
  }),
})
import { Checkbox } from '@/components/internal/checkbox'
import { Input } from '@/components/internal/input'
import { Label } from '@/components/internal/label'
import { PhoneInput } from '@/components/internal/phone-input'

interface RegisterFormProps {
  onSubmit: (data: Record<string, unknown>) => Promise<void> | void
  isPending?: boolean
  submitButtonText?: string
  includeEmail?: boolean
  readonlyEmail?: string
  className?: string
  fieldMapping?: Record<string, string>
  showTerms?: boolean
  renderSocialLogin?: (disabled: boolean) => React.ReactNode
  headerPortalTarget?: HTMLElement | null
  onStepChange?: (step: 'initial' | 'email') => void
}

const autoCompleteMap: Record<string, string> = {
  firstName: 'given-name',
  lastName: 'family-name',
  email: 'email',
  phone: 'tel',
  password: 'new-password',
}

const PASSWORD_REQUIREMENT_KEYS = [
  'minLength',
  'lowercase',
  'uppercase',
  'number',
  'symbol',
] as const

type PasswordRequirementKey = (typeof PASSWORD_REQUIREMENT_KEYS)[number]

function getPasswordRequirementChecks(
  password: string,
): Record<PasswordRequirementKey, boolean> {
  return {
    minLength: password.length >= 6,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^a-zA-Z0-9]/.test(password),
  }
}

function TermsCheckbox({
  checked,
  onChange,
  error,
  disabled: checkboxDisabled,
  shaking = false,
  t: _t,
}: {
  error?: string
  disabled?: boolean
  shaking?: boolean
  checked: boolean
  onChange: (v: boolean) => void
  t?: (key: string, params?: Record<string, unknown>) => string
}) {
  return (
    <div className={cn('flex flex-col gap-2', shaking && 'animate-shake-x')}>
      <div
        className="flex items-start gap-3 cursor-pointer"
        onClick={(e) => {
          if (e.target === e.currentTarget && !checkboxDisabled) {
            onChange(!checked)
          }
        }}
      >
        <Checkbox
          id="termsAccepted"
          checked={checked}
          onCheckedChange={(v) => onChange(!!v)}
          disabled={checkboxDisabled}
          className={cn(
            'mt-0.5 cursor-pointer transition-colors',
            shaking && 'border-destructive',
          )}
        />

        <Label
          htmlFor="termsAccepted"
          className={cn(
            'inline-block text-sm text-balance leading-relaxed cursor-pointer transition-colors',
            shaking && 'text-destructive',
          )}
        >
          {'terms'}{' '}
          <a
            href="/legal/terms"
            className="text-primary hover:text-primary/80 hover:underline underline-offset-4 transition-colors"
          >
            {'termsLink'}
          </a>
          , {'termsAnd'}{' '}
          <a
            href="/legal/privacy"
            className="text-primary hover:text-primary/80 hover:underline underline-offset-4 transition-colors"
          >
            {'privacyLink'}
          </a>
          .
        </Label>
      </div>

      {error && (
        <p className="text-sm text-destructive min-h-[20px]">{error}</p>
      )}
    </div>
  )
}

export function RegisterForm({
  onSubmit,
  isPending = false,
  submitButtonText,
  includeEmail = true,
  readonlyEmail,
  className,
  fieldMapping = {},
  showTerms = false,
  renderSocialLogin,
  headerPortalTarget,
  onStepChange,
}: RegisterFormProps) {

  const [step, setStep] = useState<'initial' | 'email'>('initial')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)

  const mounted = useIsClient()
  const tSchema = (key: string) => key
  const [termsShaking, setTermsShaking] = useState(false)

  const changeStep = useCallback(
    (next: 'initial' | 'email') => {
      setStep(next)
      onStepChange?.(next)
    },
    [onStepChange],
  )

  const withTermsGuard = useCallback(
    (fn: () => void) => {
      if (!termsAccepted) {
        setTermsShaking(true)
        setTimeout(() => setTermsShaking(false), 400)
        return
      }
      fn()
    },
    [termsAccepted],
  )

  const isTwoStep = !!renderSocialLogin && showTerms

  const formSchema = useMemo(() => {
    const SCHEMAS = createSchemas(tSchema)
    return z.object({
      firstName: SCHEMAS.REGISTER.shape.firstName,
      lastName: SCHEMAS.REGISTER.shape.lastName,
      ...((includeEmail || readonlyEmail) && {
        email: SCHEMAS.REGISTER.shape.email,
      }),
      phone: SCHEMAS.REGISTER.shape.phone,
      password: SCHEMAS.REGISTER.shape.password,
      ...(!isTwoStep &&
        showTerms && {
          termsAccepted: z.boolean().refine((value) => value, {
            message: 'termsRequired',
          }),
        }),
    })
  }, [includeEmail, readonlyEmail, isTwoStep, showTerms])

  type FormValues = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: '',
      ...(readonlyEmail ? { email: readonlyEmail } : {}),
    },
  })

  const passwordValue = useWatch({
    control,
    name: 'password',
    defaultValue: '',
  })

  const passwordRequirementChecks = useMemo(
    () => getPasswordRequirementChecks(passwordValue ?? ''),
    [passwordValue],
  )

  const showPasswordRequirements =
    isPasswordFocused || (passwordValue?.length ?? 0) > 0

  const handleFormSubmit = useCallback(
    async (formData: z.infer<typeof formSchema>) => {
      try {
        setIsSubmitting(true)

        const mappedData: Record<string, unknown> = {
          ...formData,
          ...(isTwoStep && { termsAccepted: true }),
        }

        Object.entries(fieldMapping).forEach(([from, to]) => {
          if (mappedData[from]) {
            mappedData[to] = mappedData[from]
            delete mappedData[from]
          }
        })

        await onSubmit(mappedData)
      } catch {
        setIsSubmitting(false)
      }
    },
    [fieldMapping, isTwoStep, onSubmit],
  )

  type FieldItem = {
    label: string
    name: keyof z.infer<typeof formSchema>
    type: string
    placeholder?: string
  }

  type FieldRow = FieldItem | FieldItem[]

  const fields: readonly FieldRow[] = useMemo(
    () =>
      [
        [
          {
            label: 'fields.firstName',
            name: 'firstName',
            type: 'text',
            placeholder: 'placeholders.firstName',
          },
          {
            label: 'fields.lastName',
            name: 'lastName',
            type: 'text',
            placeholder: 'placeholders.lastName',
          },
        ],
        ...(includeEmail || readonlyEmail
          ? [
              {
                label: 'fields.email',
                name: 'email' as const,
                type: 'email',
                placeholder: 'placeholders.email',
              },
            ]
          : []),
        {
          label: 'fields.phone',
          name: 'phone' as const,
          type: 'tel',
          placeholder: 'placeholders.phone',
        },
        {
          label: 'fields.password',
          name: 'password',
          type: 'text',
          placeholder: 'placeholders.password',
        },
      ] as const,
    [includeEmail, readonlyEmail],
  )

  const renderField = useCallback(
    (fieldItem: FieldItem) => {
      const { label, name, type, placeholder } = fieldItem
      const error = errors[name]?.message

      const isPasswordField = name === 'password'
      const isReadonlyEmail = name === 'email' && readonlyEmail

      if (name === 'phone') {
        return (
          <div key={name} className="space-y-3">
            <Label htmlFor={name} className="text-sm font-medium">
              {label}
            </Label>

            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  id={name}
                  data-testid={`${name}-input`}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isPending || isSubmitting}
                  autoComplete={autoCompleteMap.phone}
                  placeholder={placeholder}
                  className={cn(error && 'border-destructive')}
                />
              )}
            />

            {error && (
              <p className="text-sm text-destructive min-h-[20px]">{error}</p>
            )}
          </div>
        )
      }

      const fieldRegistration = register(name)

      return (
        <div key={name} className="space-y-3">
          <Label htmlFor={name} className="text-sm font-medium">
            {label}
          </Label>

          <div className="relative">
            <Input
              id={name}
              data-testid={`${name}-input`}
              disabled={isPending || isSubmitting || !!isReadonlyEmail}
              readOnly={!!isReadonlyEmail}
              type={
                isPasswordField ? (showPassword ? 'text' : 'password') : type
              }
              className={cn(
                'focus:border-primary/50 transition-colors',
                isPasswordField && 'pr-14',
              )}
              {...fieldRegistration}
              {...(isPasswordField
                ? {
                    onFocus: () => setIsPasswordFocused(true),
                    onBlur: (e: FocusEvent<HTMLInputElement>) => {
                      setIsPasswordFocused(false)
                      void fieldRegistration.onBlur(e)
                    },
                  }
                : {})}
              autoComplete={autoCompleteMap[name]}
              placeholder={placeholder}
              defaultValue={isReadonlyEmail ? readonlyEmail : undefined}
              {...(isPasswordField && {
                sufix: (
                  <button
                    type="button"
                    data-testid={`${name}-toggle-password`}
                    aria-label={
                      showPassword ? 'hidePassword' : 'showPassword'
                    }
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted-foreground/5 transition-colors cursor-pointer min-w-12 h-12 rounded-r-xl translate-x-2"
                  >
                    <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
                  </button>
                ),
              })}
            />
          </div>

          {isPasswordField && (
            <motion.div
              initial={false}
              animate={{
                opacity: showPasswordRequirements ? 1 : 0,
                height: showPasswordRequirements ? 'auto' : 0,
                marginBottom: showPasswordRequirements ? 0 : -16,
                marginTop: showPasswordRequirements ? 16 : 0,
              }}
              transition={{
                duration: 0.22,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="overflow-hidden"
            >
              <ul
                aria-live="polite"
                aria-hidden={!showPasswordRequirements}
                className="flex flex-col gap-1.5 text-sm"
              >
                {PASSWORD_REQUIREMENT_KEYS.map((key) => {
                  const met = passwordRequirementChecks[key]

                  return (
                    <li key={key} className="flex items-center gap-2">
                      <Icon
                        aria-hidden
                        name="CheckDouble"
                        className={cn(
                          'size-3.5 shrink-0 transition-colors fill-transparent',
                          met ? 'text-success' : 'text-muted-foreground/15',
                        )}
                      />

                      <span
                        className={cn(
                          'leading-tight transition-colors',
                          met ? 'text-foreground' : 'text-muted-foreground',
                        )}
                      >
                        {`passwordRequirements.${key}`}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </motion.div>
          )}

          {error && (
            <p className="text-sm text-destructive min-h-[20px]">{error}</p>
          )}
        </div>
      )
    },
    [
      control,
      errors,
      isPending,
      isSubmitting,
      passwordRequirementChecks,
      readonlyEmail,
      register,
      showPassword,
      showPasswordRequirements,
    ],
  )

  if (isTwoStep && step === 'initial') {
    return (
      <div className={cn('flex flex-col gap-6', className)}>
        <div
          className="relative"
          onClickCapture={
            !termsAccepted
              ? (e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setTermsShaking(true)
                  setTimeout(() => setTermsShaking(false), 400)
                }
              : undefined
          }
        >
          {renderSocialLogin(isPending)}
        </div>

        <div className="relative flex items-center justify-center gap-4 w-full -my-2 [&:before]:content-[''] [&:before]:absolute [&:before]:w-full [&:before]:h-px [&:before]:bg-border">
          <p className="uppercase text-xs text-muted-foreground/50 font-medium leading-none bg-muted px-4 z-1">
            {'or'}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => withTermsGuard(() => changeStep('email'))}
          className="w-full h-12 rounded-2xl px-6 py-3 text-sm sm:text-base active:scale-[99.35%]"
        >
          <Icon name="Envelope" size={18} className="mb-0.5" />
          {'withEmail'}
        </Button>

        <TermsCheckbox
          disabled={isPending}
          checked={termsAccepted}
          onChange={setTermsAccepted}
          shaking={termsShaking}
        />
      </div>
    )
  }

  const backButton = isTwoStep ? (
    <button
      type="button"
      onClick={() => changeStep('initial')}
      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors self-start cursor-pointer"
    >
      <Icon name="ArrowLeft" size={15} />
      {'backToOptions'}
    </button>
  ) : null

  return (
    <form
      method="POST"
      className={cn('flex flex-col gap-6', className)}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      {mounted && headerPortalTarget
        ? createPortal(backButton, headerPortalTarget)
        : backButton}

      {fields.map((field, index) => {
        if (Array.isArray(field)) {
          return (
            <div key={`row-${index}`} className="grid md:grid-cols-2 gap-4">
              {field.map((fieldItem) => renderField(fieldItem))}
            </div>
          )
        }

        return renderField(field as FieldItem)
      })}

      {!isTwoStep && showTerms && (
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-3">
            <Controller
              name={'termsAccepted' as Path<FormValues>}
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="termsAccepted"
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                  disabled={isPending || isSubmitting}
                  className="mt-0.5 cursor-pointer"
                />
              )}
            />

            <Label
              htmlFor="termsAccepted"
              className="inline-block text-sm text-balance leading-relaxed cursor-pointer"
            >
              {'terms'}{' '}
              <a
                href="/legal/terms"
                className="text-primary hover:text-primary/80 hover:underline underline-offset-4 transition-colors"
              >
                {'termsLink'}
              </a>
              , {'termsAnd'}{' '}
              <a
                href="/legal/privacy"
                className="text-primary hover:text-primary/80 hover:underline underline-offset-4 transition-colors"
              >
                {'privacyLink'}
              </a>
              .
            </Label>
          </div>

          {(() => {
            const err = errors as Partial<Record<string, { message?: string }>>;
            if (!err.termsAccepted) return null;
            return (
              <p className="text-sm text-destructive min-h-[20px]">
                {err.termsAccepted.message}
              </p>
            );
          })()}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        data-testid="submit"
        disabled={!isValid || isPending || isSubmitting}
        isLoading={isPending || isSubmitting}
        className={cn(
          'rounded-2xl px-6 py-3 min-h-12 text-sm sm:text-base active:scale-[99.35%] ring-6',
          Object.keys(errors).length > 0 &&
            'ring-destructive/15 bg-destructive',
          isValid ? 'ring-primary/15 bg-primary' : 'ring-transparent',
        )}
      >
        {submitButtonText || 'submit'}
      </Button>
    </form>
  )
}
