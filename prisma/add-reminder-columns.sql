-- Paleiskite Turso/SQLite jei stulpeliai dar neegzistuoja:
ALTER TABLE "PaymentRequest" ADD COLUMN "nextReminderAt" DATETIME;
ALTER TABLE "PaymentRequest" ADD COLUMN "lastRemindedAt" DATETIME;
