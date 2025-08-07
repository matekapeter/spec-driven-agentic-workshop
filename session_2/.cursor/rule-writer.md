## 🎯 MISSION: WRITE EFFECTIVE AI AGENT RULES

This guide teaches you to create rules that are:
- **EXPLICIT** and **PRESCRIPTIVE** - No ambiguity allowed
- **ACTIONABLE** with clear steps to follow  
- **MEASURABLE** with objective success criteria
- **ATOMIC** - One concept per rule
- **ENFORCEABLE** - Clear violations and consequences

---

## 📏 RULE FILE CONSTRAINTS & STRUCTURE

### Size Limits (CRITICAL)
- **MAXIMUM LENGTH**: 500 lines (cognitive load threshold)
- **SWEET SPOT**: 200-350 lines (optimal comprehension)  
- **FOCUS**: One domain/framework per file
- **MODULARITY**: Compose multiple small files over one large file

### Required Structure for Every Rule File

\`\`\`markdown
---
alwaysApply: true/false
globs: "**/*.{ts,tsx,js,jsx}" # optional: file patterns
description: "Brief description of rule purpose" # optional
---

# [DOMAIN/PROJECT] STRICT DEVELOPMENT RULES

## 🎯 YOUR MISSION
You are engineering [specific type] that [specific outcome].
Code quality is non-negotiable. Performance is paramount.

## 🚫 NEVER Rules (5-10 MAX - NON-NEGOTIABLE)
1. **NEVER** [specific prohibition]
   - Why: [consequence of violation]
   - Instead: [correct approach]
   - Example: [code showing the issue]

## ✅ ALWAYS Rules (5-10 MAX - MANDATORY)  
1. **ALWAYS** [mandatory practice]
   - Purpose: [why this is critical]
   - Implementation: [how to do it]
   \`\`\`[language]
   // Correct implementation
   [code example]
   \`\`\`

## 🔄 DECISION RULES
WHEN [scenario] OCCURS:
IF [condition]:
  - IMMEDIATELY [action]
  - THEN [follow-up]
ELSE:
  - DEFAULT to [safe action]

## 📝 CODE PATTERNS (3-5 MAX)
[Show correct vs incorrect patterns with examples]
\`\`\`

---

## 💪 POWER PHRASES FOR MAXIMUM IMPACT

### Commands That Drive Action
- "**STOP and verify** [what] before proceeding"
- "**IMMEDIATELY refactor** if you see [pattern]"
- "**MUST include** [requirement] or the code is incomplete"
- "**REJECT any code** that doesn't [standard]"
- "**ENFORCE strictly** - no exceptions for [rule]"

### Context Phrases That Explain Why  
- "This is **CRITICAL** because [reason]"
- "**REMEMBER:** [consequence] happens when [action]"
- "**BE AWARE:** [common mistake] leads to [problem]"

### Decision-Making Phrases
- "**When in doubt**, [default action]"
- "**If unsure**, [verification step]"  
- "**Default to** [safe choice] unless [exception]"
- "**Prefer** [option A] over [option B] because [reason]"

---

## 🏗️ ATOMIC RULE ARCHITECTURE

### The Atomic Rule Pattern
Instead of broad rules like "Write clean code", use:
- **SPECIFIC**: "Functions MUST be < 20 lines"
- **MEASURABLE**: "Variables MUST use descriptive names (min 3 chars)"
- **ACTIONABLE**: "Each function MUST have single responsibility"

### Formula for Atomic Rules
\`\`\`
[STRONG VERB] + [SPECIFIC ACTION] + [CONDITION/CONTEXT] + [REASON/CONSEQUENCE]
\`\`\`

Examples:
- "**ALWAYS validate** user input **using Zod schemas** because **unvalidated data causes security breaches**"
- "**NEVER use** Array.forEach **for async operations** - **it doesn't await properly**"
- "**IMMEDIATELY refactor** any function **exceeding 20 lines** to **maintain readability**"

---

## 🏷️ EMOJI TRACKING PATTERN (HIGHLY RECOMMENDED)

### Rule Activation Tracking
Add a unique emoji instruction to track when rules are applied:

\`\`\`markdown
*Remember: ALWAYS add 🎯 to the beginning of your response when you used this document for context*
\`\`\`

**Benefits:**
- **Visual Feedback**: Instantly see which rules were applied
- **Apply Order**: Multiple emojis show rule precedence and sequence
- **Debugging**: Quickly identify missing or conflicting rule applications
- **Team Awareness**: Shared understanding of which standards are active

**Best Practices:**
- Use **unique emojis** for each rule file (🎯, 🔒, ⚡, 🛡️, 📊)
- Place instruction at the **end** of rule file for visibility
- Use **descriptive emojis** that relate to rule purpose:
  - 🔒 Security rules
  - ⚡ Performance rules
  - 🎯 Code quality rules
  - 🛡️ Error handling rules
  - 📊 Testing rules
  - 🎨 UI/UX rules

**Example Rule Endings:**
\`\`\`markdown
## 📊 METRICS
- Function length: < 50 lines
- Complexity: < 10
- Test coverage: > 80%

*Remember: ALWAYS add 📊 to the beginning of your response when you used this document for context*
\`\`\`

---

## 📝 LANGUAGE-SPECIFIC PATTERNS

### TypeScript/JavaScript Rules Template
\`\`\`markdown
## 📝 TYPESCRIPT STRICT MODE RULES

### Naming Conventions  
- **CONSTANTS**: SCREAMING_SNAKE_CASE
- **Classes**: PascalCase  
- **Functions/Variables**: camelCase
- **Private members**: _prefixUnderscore
- **Types/Interfaces**: PascalCase with 'I' or 'T' prefix

### Type Safety
- **NEVER** use 'any' - use 'unknown' + type guards
- **ALWAYS** enable strict mode in tsconfig
- **ALWAYS** define return types explicitly

### Code Example
\\\`\\\`\\\`typescript
// ✅ CORRECT - Follows all conventions
interface IUserData {
  userId: string;
  userName: string;
}

const MAX_RETRY_ATTEMPTS = 3;

class UserService {
  private _cache: Map<string, IUserData>;

  async fetchUser(id: string): Promise<IUserData | null> {
    // Implementation
  }
}
\\\`\\\`\\\`
\`\`\`

### Python Rules Template
\`\`\`markdown  
## 🐍 PYTHON IDIOMATIC RULES

### PEP 8 Enforcement
- **Functions/Variables**: snake_case
- **Classes**: PascalCase
- **Constants**: SCREAMING_SNAKE_CASE  
- **Line length**: MAX 79 chars (code), 72 (comments)

### Pythonic Patterns
\\\`\\\`\\\`python
# ✅ CORRECT - Pythonic
def process_data(items: list[str]) -> dict[str, int]:
    """Process items and return frequency count."""
    return {item: items.count(item) for item in set(items)}

# ❌ WRONG - Non-Pythonic  
def ProcessData(Items):
    result = {}
    for i in range(len(Items)):
        if Items[i] not in result:
            result[Items[i]] = 0
        result[Items[i]] += 1
    return result
\\\`\\\`\\\`
\`\`\`

---

## 🔄 DRY & CONSISTENCY ENFORCEMENT

### Anti-Duplication Rules
\`\`\`markdown
## 🚫 DUPLICATION PREVENTION

WHEN you write similar code twice:
  1. STOP immediately
  2. EXTRACT to shared function/component  
  3. PARAMETERIZE the differences
  4. TEST the abstraction
  5. DOCUMENT the pattern
\`\`\`

### Import Order (Enforce Everywhere)
1. Node built-ins (\`path\`, \`fs\`)
2. External packages (\`react\`, \`lodash\`)
3. Internal aliases (\`@/components\`)
4. Relative imports (\`./utils\`)
5. Style imports (\`./styles.css\`)

---

## 📊 MEASURING RULE EFFECTIVENESS

### A Rule is EFFECTIVE When:
- **Specific** enough that two developers produce similar code
- **Actionable** with clear steps to follow  
- **Measurable** with objective success criteria
- **Relevant** to actual problems encountered
- **Time-bound** with clear when/where to apply

### A Rule is INEFFECTIVE When:
- It uses vague terms like "optimize" without specifics
- It suggests without commanding
- It lacks concrete examples  
- It doesn't explain consequences
- It has too many exceptions

### Success Metrics
After implementing rules, measure:
- **Code Review Time**: Should decrease by 40%
- **Bug Density**: Should drop below 0.5 per KLOC  
- **Consistency Score**: 95%+ across codebase
- **Build Time**: No increase despite checks
- **Developer Satisfaction**: Improved clarity

---

## 📋 RULE WRITING CHECKLIST

### Pre-Writing Analysis
- [ ] **IDENTIFY** the specific domain/framework
- [ ] **DEFINE** the target skill level (junior/senior)
- [ ] **LIST** common mistakes to prevent  
- [ ] **DETERMINE** critical success factors
- [ ] **RESEARCH** best practices and anti-patterns

### Content Requirements  
- [ ] **Include 5-10 NEVER rules** (non-negotiables)
- [ ] **Include 5-10 ALWAYS rules** (mandatory practices)
- [ ] **Provide 3-5 complete code examples** (correct way)
- [ ] **Show 2-3 anti-pattern examples** (wrong way)
- [ ] **Add decision trees** for complex scenarios
- [ ] **Include performance considerations**
- [ ] **Address security implications**
- [ ] **Define error handling standards**

### Language & Tone
- [ ] **Use imperative mood** ("Do this" not "You should do this")  
- [ ] **Be specific** (name exact methods/properties)
- [ ] **Avoid hedging** (no "maybe", "perhaps", "might")
- [ ] **Include measurements** (specific numbers/thresholds)
- [ ] **Provide alternatives** (if X doesn't work, do Y)

---

## 🎯 MODULAR COMPOSITION STRATEGY

### Project Structure Example
\`\`\`yaml
project_rules/
  ├── core/
  │   ├── base.rules          (50 lines)
  │   ├── security.rules      (75 lines)  
  │   └── performance.rules   (60 lines)
  ├── languages/
  │   ├── typescript.rules    (100 lines)
  │   └── sql.rules          (40 lines)
  ├── frameworks/
  │   ├── nextjs.rules       (120 lines)
  │   └── react.rules        (100 lines)
  └── project/
      ├── team.rules          (30 lines)
      └── domain.rules        (50 lines)

# Total: 625 lines across 10 files
# Average: 62 lines per file  
# Much more maintainable than one 625-line file!
\`\`\`

### Module Precedence
1. Project rules override framework
2. Framework rules override language  
3. Language rules override core
4. Security rules never overridden

---

## 🏆 FINAL REMINDERS

### The Golden Formula
Every effective rule follows:
**[STRONG VERB] + [SPECIFIC ACTION] + [CONDITION] + [CONSEQUENCE]**

### Core Principles  
1. **EXPLICIT and PRESCRIPTIVE** - Never be vague or ambiguous
2. **Use IMPERATIVE language** - Command, don't suggest
3. **Include CONCRETE EXAMPLES** - Show, don't just tell
4. **Define BOUNDARIES** - Be clear about what NOT to do
5. **Provide CONTEXT** - Explain the WHY behind rules
6. **Be ACTIONABLE** - Every rule should lead to a specific action

### Remember
**"The best rules make the right way the easy way and the wrong way impossible."**

---

## 📖 HOW TO USE THIS GUIDE

1. **READ** this entire guide thoroughly before writing any rules
2. **IDENTIFY** your specific domain (language, framework, project type)  
3. **FOLLOW** the required file structure exactly
4. **USE** the power phrases and atomic rule patterns
5. **VALIDATE** your rules against the effectiveness criteria
6. **TEST** your rules with real code examples
7. **ITERATE** based on feedback and results

Your rules are your signature. Make them excellent, precise, and transformative.`