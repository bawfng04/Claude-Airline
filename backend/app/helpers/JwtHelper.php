<?php
class JwtHelper {
    private function base64url_encode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    public function generateJWT($header, $payload, $secret) {
        $headerEncoded = $this->base64url_encode(json_encode($header));
        $payloadEncoded = $this->base64url_encode(json_encode($payload));
        $signature = hash_hmac('sha256', "$headerEncoded.$payloadEncoded", $secret, true);
        $signatureEncoded = $this->base64url_encode($signature);
        return "$headerEncoded.$payloadEncoded.$signatureEncoded";
    }

    public function decodeTokenPayload($token) {
        $parts = explode('.', $token);

        if (count($parts) !== 3) {
            return null;
        }

        $payload = base64_decode(strtr($parts[1], '-_', '+/'));

        if ($payload === false) {
            return null;
        }

        $data = json_decode($payload, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return null;
        }

        return $data;
    }
}
