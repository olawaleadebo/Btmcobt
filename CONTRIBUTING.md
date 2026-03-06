# Contributing to Corporate Booking Tool

Thank you for your interest in contributing to COBT! This document provides guidelines for contributing to the project.

## 🌟 How to Contribute

### Reporting Bugs

1. **Check existing issues** - Search for similar issues first
2. **Create detailed report** - Include:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser/OS information
   - Console errors

### Suggesting Features

1. **Check roadmap** - Review existing feature requests
2. **Create feature request** - Include:
   - Clear description of the feature
   - Use case and benefits
   - Proposed implementation (optional)
   - Mockups or examples (optional)

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Create Pull Request**

## 📝 Code Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types/interfaces
- Avoid `any` type when possible
- Use meaningful variable names

```typescript
// ✅ Good
interface BookingData {
  userId: string;
  price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

// ❌ Bad
interface Data {
  id: any;
  p: number;
  s: string;
}
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic to custom hooks
- Use proper prop types

```typescript
// ✅ Good
interface Props {
  title: string;
  onSubmit: (data: FormData) => void;
}

export const MyComponent: React.FC<Props> = ({ title, onSubmit }) => {
  // Component logic
};

// ❌ Bad
export const MyComponent = (props: any) => {
  // Component logic
};
```

### File Organization

```
src/app/
├── components/           # Reusable components
│   ├── ui/              # Base UI components
│   └── [ComponentName].tsx
├── pages/               # Page components
│   └── [PageName].tsx
├── layouts/             # Layout wrappers
│   └── [LayoutName].tsx
├── hooks/               # Custom hooks
│   └── use[HookName].ts
└── utils/               # Utility functions
    └── [utilName].ts
```

### Naming Conventions

- **Components**: PascalCase (e.g., `BookingCard.tsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useAuth.ts`)
- **Utils**: camelCase (e.g., `formatDate.ts`)
- **Types**: PascalCase (e.g., `User`, `BookingData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

### CSS/Tailwind

- Use Tailwind utility classes
- Follow mobile-first approach
- Group related classes
- Use custom CSS only when necessary

```tsx
// ✅ Good
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">
  {/* Content */}
</div>

// ❌ Bad (too many arbitrary values)
<div className="flex items-center gap-[17px] p-[23px] bg-[#ffffff]">
  {/* Content */}
</div>
```

## 🧪 Testing

### Manual Testing

Before submitting PR, test:
- [ ] All existing features still work
- [ ] New feature works as expected
- [ ] Responsive design on mobile/tablet/desktop
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Accessibility (keyboard navigation, screen readers)

### Browser Testing

Test on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## 📦 Pull Request Process

### PR Title Format

```
[Type] Short description

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes (formatting)
- refactor: Code refactoring
- perf: Performance improvements
- test: Adding tests
- chore: Maintenance tasks
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Screenshots (if applicable)
[Add screenshots here]

## Testing
- [ ] Tested locally
- [ ] Tested on mobile
- [ ] No console errors
- [ ] No TypeScript errors

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## 🎨 Design Guidelines

### Component Design

- **Consistency**: Follow existing component patterns
- **Accessibility**: Use semantic HTML and ARIA labels
- **Responsiveness**: Mobile-first design
- **Performance**: Optimize re-renders and bundle size

### UI/UX Principles

1. **Clarity**: User actions should be obvious
2. **Feedback**: Show loading states and confirmations
3. **Error Handling**: Display helpful error messages
4. **Consistency**: Maintain design language across app

## 🔧 Development Workflow

### Setting Up

1. Clone your fork
   ```bash
   git clone https://github.com/your-username/cobt.git
   cd cobt
   ```

2. Add upstream remote
   ```bash
   git remote add upstream https://github.com/original/cobt.git
   ```

3. Install dependencies
   ```bash
   npm install
   ```

4. Create feature branch
   ```bash
   git checkout -b feature/my-feature
   ```

### Staying Updated

1. Fetch upstream changes
   ```bash
   git fetch upstream
   ```

2. Merge into your branch
   ```bash
   git merge upstream/main
   ```

3. Resolve conflicts if any

### Committing Changes

Use conventional commit messages:

```bash
# Feature
git commit -m "feat: add flight filtering by price"

# Bug fix
git commit -m "fix: resolve payment modal not closing"

# Documentation
git commit -m "docs: update API integration guide"

# Refactor
git commit -m "refactor: simplify booking service logic"
```

## 🐛 Debugging Tips

### Frontend Debugging

1. **React DevTools**: Inspect component tree and props
2. **Console Logging**: Use strategic console.logs
3. **Network Tab**: Check API requests/responses
4. **Redux DevTools**: Monitor state changes (if using Redux)

### Common Issues

**TypeScript Errors**
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
npm run dev
```

**Package Issues**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build Errors**
```bash
# Check for unused imports
# Check for missing dependencies
npm run build
```

## 📚 Resources

### Documentation
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com/)

### Tools
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [VS Code](https://code.visualstudio.com/)
- [Postman](https://www.postman.com/) - API testing

### Recommended VS Code Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Error Translator
- GitLens

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## ❓ Questions?

- Open a discussion on GitHub
- Contact project maintainers
- Join our community chat

## 📄 License

By contributing, you agree that your contributions will be licensed under the project's license.

---

**Thank you for contributing to COBT! 🎉**
