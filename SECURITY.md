# Security Policy

## Reporting a Vulnerability

We take security seriously and appreciate your help in responsibly disclosing security vulnerabilities. If you discover a security issue in ShikshaSathi, please help us by not disclosing it publicly until we've had a chance to address it.

### How to Report

Please email security concerns to **sharshitsingh007@gmail.com** with the following information:

- **Description**: A clear description of the vulnerability
- **Location**: The file(s), component(s), or area(s) affected
- **Steps to Reproduce**: Clear steps to reproduce the issue (if applicable)
- **Impact**: The potential impact of this vulnerability
- **Suggested Fix**: Any proposed fix or mitigation (optional)

### Response Timeline

We will:
- Acknowledge receipt of your report within **48 hours**
- Provide a timeline for a fix within **7 days** of confirmation
- Keep you informed of progress toward a resolution
- Credit you in security advisories (if you wish to be credited)

## Security Guidelines

### For Contributors

When contributing to ShikshaSathi, please follow these security best practices:

1. **Input Validation**: Always validate and sanitize user inputs, especially for:
   - API endpoints
   - File uploads
   - Text processing (Hinglish content)
   - Quiz/activity parameters

2. **Authentication & Authorization**: 
   - Implement proper access controls
   - Use secure session management
   - Validate user permissions for sensitive operations

3. **Data Protection**:
   - Protect sensitive educational data
   - Use HTTPS for all data transmission
   - Encrypt sensitive data at rest
   - Comply with educational privacy regulations (e.g., FERPA, local Indian regulations)

4. **Dependency Management**:
   - Keep dependencies up to date
   - Run `npm audit` regularly and address vulnerabilities
   - Review dependency licenses
   - Use trusted packages only

5. **Code Security**:
   - Avoid hardcoding secrets, API keys, or credentials
   - Use environment variables for sensitive configuration
   - Implement proper error handling without exposing sensitive details
   - Use secure coding practices for the TypeScript codebase

6. **AI/ML Security**:
   - Validate AI-generated content before presenting to students
   - Implement safeguards against inappropriate content generation
   - Log and monitor AI interactions for security purposes
   - Regularly review AI outputs for bias or safety issues

7. **Offline Functionality**:
   - Ensure offline mode doesn't compromise security
   - Validate data synced from offline to online modes
   - Implement secure local storage for cached data

### Known Security Considerations

- This is an educational tool for Indian school classrooms - content safety and child protection are paramount
- Offline-first architecture should not bypass security checks
- Multi-language support should include validation to prevent injection attacks

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | ✅ Supported       |
| Older   | ⚠️ Best effort     |

## Security Updates

- Security updates will be released as soon as possible when vulnerabilities are confirmed
- Critical vulnerabilities will trigger emergency releases
- All security updates will be documented in release notes

## Third-Party Dependencies

This project uses several dependencies. We regularly monitor them for security vulnerabilities using:
- `npm audit`
- Dependabot alerts
- Manual reviews

## Questions or Concerns?

If you have general security questions about using ShikshaSathi, please:
1. Check the main README.md
2. Open a discussion in the Discussions tab
3. Contact the maintainers

---

**Thank you for helping keep ShikshaSathi secure!** 🔒

*Last Updated: 2026-08-13*
