import { z } from "zod";

// Polski numer telefonu: dopuszczamy spacje, myślniki i opcjonalny prefiks +48.
const phoneRegex = /^(\+?48[\s-]?)?(\d[\s-]?){9}$/;

export const bookingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Podaj imię i nazwisko (min. 2 znaki).")
    .max(120, "To pole jest zbyt długie."),
  company: z
    .string()
    .trim()
    .max(160, "To pole jest zbyt długie.")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .trim()
    .min(9, "Podaj numer telefonu.")
    .regex(phoneRegex, "Podaj poprawny polski numer telefonu."),
  email: z
    .string()
    .trim()
    .email("Podaj poprawny adres e-mail.")
    .optional()
    .or(z.literal("")),
  topic: z.string().trim().min(1, "Wybierz temat rozmowy."),
  message: z
    .string()
    .trim()
    .max(1000, "Wiadomość może mieć maks. 1000 znaków.")
    .optional()
    .or(z.literal("")),
  date: z.string().trim().min(1, "Wybierz dzień rozmowy."),
  time: z.string().trim().min(1, "Wybierz godzinę rozmowy."),
  consent: z
    .boolean()
    .refine((v) => v === true, "Zgoda na kontakt jest wymagana."),
});

export type BookingInput = z.infer<typeof bookingSchema>;
