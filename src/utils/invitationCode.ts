const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const isInvitationCode = (value: unknown): value is string =>
    typeof value === 'string' && /^[A-HJ-NP-Z2-9]{8}$/.test(value);

/** Local identity mock only; global uniqueness is the server's responsibility. */
export const createInvitationCode = (): string => {
    let code = '';
    while (code.length < 8) {
        const bytes = crypto.getRandomValues(new Uint8Array(16));
        for (const byte of bytes) {
            // Reject the remainder so each character has equal probability.
            if (byte >= Math.floor(256 / ALPHABET.length) * ALPHABET.length) continue;
            code += ALPHABET[byte % ALPHABET.length];
            if (code.length === 8) break;
        }
    }
    return code;
};

export const resolveInvitationCode = (isGuest: boolean, stored?: unknown): string =>
    isGuest ? '' : isInvitationCode(stored) ? stored : createInvitationCode();
