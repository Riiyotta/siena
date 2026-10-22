// Link with the coral underline that slides in from the left on hover and back out to the left
// on leave (CLONE_SPEC §13 "Nav link"). The line sits under the label only (not the optional
// leading icon). Styles in src/styles/nav.css (.ul-link).
export default function UnderlineLink({ href, before = null, children, className = '', labelClassName = '', ...rest }) {
  return (
    <a href={href} className={`ul-link ${className}`} {...rest}>
      {before}
      <span className={`ul-link__label ${labelClassName}`}>
        {children}
        <span className="ul-link__line-wrap" aria-hidden="true">
          <span className="ul-link__line" />
        </span>
      </span>
    </a>
  )
}
