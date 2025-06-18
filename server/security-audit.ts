class SecurityAuditLogger {
  logEvent(event: any): void {
    // Minimal logging for size optimization
  }
}

export const securityAudit = new SecurityAuditLogger();