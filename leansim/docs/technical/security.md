# Security Practices for LeanSim

This document outlines the key security practices that should be implemented in the LeanSim project to protect user data, prevent unauthorized access, and maintain the integrity of the application.

## 1. OWASP Top 10 Mitigations

### 1.1 Injection Prevention

**Implementation:**

- Use Prisma ORM's parameterized queries to prevent SQL injection
- Example:

  ```typescript
  // SAFE: Using Prisma's type-safe queries
  const user = await prisma.simulation.findUnique({
    where: { id: simulationId },
  });

  // AVOID: Raw SQL queries with string concatenation
  ```

### 1.2 Broken Authentication Protection

**Implementation:**

- Implement proper session management with Next.js middleware
- Use secure HTTP-only cookies for session tokens
- Apply proper password hashing if user authentication is added later
- Example:
  ```typescript
  // In middleware.ts
  export function middleware(request: NextRequest) {
    const token = request.cookies.get("session_token");
    // Verify token and protect routes
  }
  ```

### 1.3 Sensitive Data Exposure Prevention

**Implementation:**

- Use HTTPS for all communications (enforced by Vercel)
- Implement proper data classification
- Encrypt sensitive data at rest in the database
- Example:

  ```typescript
  // Example of encrypting sensitive data before storing
  import { encrypt, decrypt } from "../lib/encryption";

  // Before saving to database
  const encryptedData = encrypt(sensitiveData, process.env.ENCRYPTION_KEY);
  ```

### 1.4 XML External Entities (XXE) Protection

**Implementation:**

- Use safe JSON parsers and avoid XML processing where possible
- If XML is needed, configure parsers to disable external entity processing

### 1.5 Broken Access Control Prevention

**Implementation:**

- Implement proper authorization checks in API routes
- Use middleware to validate access rights to resources
- Example:
  ```typescript
  // API route with authorization check
  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    // Check if device ID matches simulation owner
    const simulation = await prisma.simulation.findUnique({
      where: { id: req.query.id as string },
    });

    if (simulation.deviceId !== req.cookies.deviceId) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    // Process authorized request
  }
  ```

### 1.6 Security Misconfiguration Prevention

**Implementation:**

- Use security headers with Next.js config
- Remove unnecessary features and frameworks
- Example:

  ```typescript
  // In next.config.js
  const securityHeaders = [
    {
      key: "X-XSS-Protection",
      value: "1; mode=block",
    },
    {
      key: "X-Content-Type-Options",
      value: "nosniff",
    },
    // Add other security headers
  ];

  module.exports = {
    async headers() {
      return [
        {
          source: "/:path*",
          headers: securityHeaders,
        },
      ];
    },
  };
  ```

### 1.7 Cross-Site Scripting (XSS) Prevention

**Implementation:**

- Implement Content-Security-Policy headers
- Use React's built-in XSS protection by avoiding dangerouslySetInnerHTML
- Sanitize user inputs before displaying
- Example:

  ```typescript
  // Sanitizing user input
  import DOMPurify from "dompurify";

  // Before rendering user content
  const sanitizedContent = DOMPurify.sanitize(userProvidedContent);
  ```

### 1.8 Insecure Deserialization Prevention

**Implementation:**

- Validate and sanitize all data before deserialization
- Use JSON Web Tokens (JWT) with proper signature verification
- Example:

  ```typescript
  // Validating data structure before processing
  import { z } from "zod";

  const InputSchema = z.object({
    name: z.string().min(1).max(100),
    // Other expected fields with validations
  });

  // In API route
  try {
    const validatedData = InputSchema.parse(req.body);
    // Process validated data
  } catch (error) {
    return res.status(400).json({ error: "Invalid input data" });
  }
  ```

### 1.9 Using Components with Known Vulnerabilities Prevention

**Implementation:**

- Regularly update dependencies with `npm audit` and fixes
- Set up automated vulnerability scanning in CI/CD pipeline
- Example:
  ```bash
  # Add to package.json scripts
  "scripts": {
    "security-check": "npm audit",
    "precommit": "npm run security-check"
  }
  ```

### 1.10 Insufficient Logging & Monitoring Prevention

**Implementation:**

- Implement structured logging for security-relevant events
- Set up monitoring for suspicious activities
- Example:

  ```typescript
  // Logging service
  import logger from "../lib/logger";

  // In API route
  logger.info("Simulation created", {
    simulationId: newSimulation.id,
    deviceId: req.cookies.deviceId,
    timestamp: new Date().toISOString(),
  });
  ```

## 2. API Security

### 2.1 Rate Limiting

**Implementation:**

- Add rate limiting to API routes to prevent abuse
- Example:

  ```typescript
  // Using Next.js API middleware
  import rateLimit from "../lib/rate-limit";

  const limiter = rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 500, // Max 500 users per interval
  });

  export default async function handler(req, res) {
    try {
      await limiter.check(res, 10, "CACHE_TOKEN"); // 10 requests per minute
      // Handle the request
    } catch {
      return res.status(429).json({ error: "Rate limit exceeded" });
    }
  }
  ```

### 2.2 API Versioning

**Implementation:**

- Structure API routes with version prefixes
- Example:
  ```
  /api/v1/simulations
  ```

### 2.3 Input Validation

**Implementation:**

- Validate all API inputs using a schema validation library like Zod or Joi
- Example:

  ```typescript
  // Using Zod for validation
  import { z } from "zod";

  const SimulationSchema = z.object({
    name: z.string().min(3).max(100),
    // Other fields with validations
  });

  export default async function handler(req, res) {
    try {
      const data = SimulationSchema.parse(req.body);
      // Process validated data
    } catch (error) {
      return res.status(400).json({ error: error.errors });
    }
  }
  ```

## 3. Database Security

### 3.1 Prisma ORM Security

**Implementation:**

- Use environment variables for database connection strings
- Implement database access permissions using Prisma's security features
- Example:
  ```typescript
  // In schema.prisma
  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }
  ```

### 3.2 Database Encryption

**Implementation:**

- Encrypt sensitive columns in the database
- Use TLS for database connections
- Example:
  ```
  // Database URL with SSL enabled
  DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
  ```

### 3.3 Database Backup and Recovery

**Implementation:**

- Set up regular automated backups
- Implement proper backup encryption
- Test recovery procedures regularly

## 4. Frontend Security

### 4.1 Content Security Policy (CSP)

**Implementation:**

- Configure strict CSP headers to prevent XSS and data injection
- Example:
  ```typescript
  // In next.config.js
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
  }
  ```

### 4.2 HTTPS Only

**Implementation:**

- Force HTTPS for all connections (automatic with Vercel)
- Implement HSTS headers
- Example:
  ```typescript
  // In next.config.js
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  }
  ```

### 4.3 Secure Form Handling

**Implementation:**

- Implement CSRF protection for all forms
- Validate all form inputs on both client and server
- Example:
  ```jsx
  // Using hidden CSRF token in forms
  <form method="post" action="/api/simulations">
    <input type="hidden" name="csrfToken" value={csrfToken} />
    {/* Other form fields */}
  </form>
  ```

## 5. Data Protection and Privacy

### 5.1 Data Minimization

**Implementation:**

- Collect only necessary data for the functionality
- Implement proper data retention policies
- Example:
  ```typescript
  // Automatic data pruning for old simulations
  const pruneOldSimulations = async () => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    await prisma.simulation.deleteMany({
      where: {
        updatedAt: {
          lt: threeMonthsAgo,
        },
      },
    });
  };
  ```

### 5.2 Cookie Security

**Implementation:**

- Use secure, HTTP-only cookies with proper expiration
- Add SameSite attribute to prevent CSRF
- Example:
  ```typescript
  // Setting secure cookies
  res.setHeader(
    "Set-Cookie",
    `deviceId=${deviceId}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${
      60 * 60 * 24 * 30
    }`
  );
  ```

### 5.3 Sensitive Information Handling

**Implementation:**

- Never log sensitive information
- Mask sensitive data in error messages
- Example:
  ```typescript
  // Masking sensitive data
  const maskSensitiveData = (data) => {
    return {
      ...data,
      financialData: {
        ...data.financialData,
        monthlyRevenue: "***MASKED***",
      },
    };
  };
  ```

## 6. DevOps Security (CI/CD Pipeline)

### 6.1 Secret Management

**Implementation:**

- Use Vercel environment variables for secrets
- Never commit secrets to the repository
- Example:
  ```typescript
  // Accessing secrets
  const apiKey = process.env.API_KEY;
  ```

### 6.2 Dependency Scanning

**Implementation:**

- Add vulnerability scanning to CI/CD pipeline
- Update dependencies regularly
- Example GitHub Actions workflow:
  ```yaml
  name: Security Scan
  on: [push, pull_request]
  jobs:
    security:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v2
        - name: Run npm audit
          run: npm audit
  ```

### 6.3 Security Testing

**Implementation:**

- Integrate security tests in the CI/CD pipeline
- Perform regular penetration testing
- Example:
  ```yaml
  # In test script
  "scripts": { "test:security": "jest --config jest.security.config.js" }
  ```

## 7. Compliance Considerations

### 7.1 GDPR Compliance (if applicable)

**Implementation:**

- Provide clear privacy policies
- Implement data subject rights (export, deletion)
- Example data export endpoint:
  ```typescript
  // API route for data export
  export default async function handler(req, res) {
    const { deviceId } = req.cookies;

    const userSimulations = await prisma.simulation.findMany({
      where: { deviceId },
      include: {
        leanCanvas: true,
        financialData: true,
      },
    });

    return res.status(200).json(userSimulations);
  }
  ```

### 7.2 CCPA Compliance (if applicable)

**Implementation:**

- Honor "Do Not Sell My Data" requests
- Maintain records of consent

## 8. Security Monitoring and Incident Response

### 8.1 Logging

**Implementation:**

- Implement comprehensive logging of security events
- Use structured logging formats
- Example:
  ```typescript
  // Structured logging
  logger.warn("Failed login attempt", {
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    timestamp: new Date().toISOString(),
    userAgent: req.headers["user-agent"],
  });
  ```

### 8.2 Monitoring

**Implementation:**

- Set up alerts for suspicious activities
- Monitor application performance and availability
- Example:
  ```typescript
  // Monitoring middleware
  export function monitoringMiddleware(req, res, next) {
    const start = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - start;
      logger.info("Request processed", {
        path: req.path,
        method: req.method,
        statusCode: res.statusCode,
        duration,
        timestamp: new Date().toISOString(),
      });
    });

    next();
  }
  ```

### 8.3 Incident Response Plan

**Implementation:**

- Define roles and responsibilities for security incidents
- Document incident response procedures
- Practice incident response scenarios

## 9. References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Prisma Security Best Practices](https://www.prisma.io/docs/concepts/components/prisma-client/security)
- [Vercel Security](https://vercel.com/docs/concepts/security)
