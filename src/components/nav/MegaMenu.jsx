import UnderlineLink from './UnderlineLink.jsx'
import {
  PRODUCT_COLUMNS, CAPABILITIES, RESOURCE_LINKS, BLOG_POSTS, WORKS_WITH,
  INTEGRATIONS_HREF, VIEW_INTEGRATIONS_ICON, COMING_SOON_ICON,
} from './navData.js'

// "Coming soon" pill (bg #fff, radius 24, padding 4px 8px, gap 8). The saved HTML renders both pills at
// opacity 0 / translateY(50px); their reveal trigger is not in the spec, so they stay hidden.
function ComingSoon({ className }) {
  return (
    <div className={`mm-soon ${className}`} aria-hidden="true">
      <span className="font-fa text-[12px] leading-[12px] text-ink">{COMING_SOON_ICON}</span>
      <span className="text-[12px] leading-[18px] text-coral">Coming soon</span>
    </div>
  )
}

function Eyebrow({ children }) {
  return <p className="mm-eyebrow">{children}</p>
}

function AgentItem({ item }) {
  return (
    <a href={item.href} className="block w-full rounded-[16px] p-[1px]">
      <div className="flex flex-row items-center gap-[24px] rounded-[15px] bg-cream p-[8px]">
        <div className="mm-icon-box">
          <span className="font-fa block h-[20px] w-[20px] text-center text-[20px] leading-[20px] text-ink">{item.icon}</span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-start gap-[8px]">
          <p className="font-serif text-[18px] leading-[23.4px] tracking-[-0.18px] text-ink">{item.title}</p>
          <p className="text-[14px] leading-[15.4px] text-ink">{item.desc}</p>
        </div>
      </div>
    </a>
  )
}

function IconLink({ href, icon, children, gap }) {
  return (
    <UnderlineLink
      href={href}
      className="flex flex-row items-center"
      style={{ gap }}
      labelClassName="text-[16px] font-medium leading-[16px] text-ink"
      before={
        <span className="flex w-[24px] items-center">
          <span className="font-fa text-[16px] leading-[16px] text-icon-grey">{icon}</span>
        </span>
      }
    >
      {children}
    </UnderlineLink>
  )
}

export function ProductsPanel() {
  return (
    <>
      <div className="flex flex-row gap-[40px] px-[8px] pt-[16px]">
        <div className="flex w-full flex-row items-start gap-[16px]">
          {PRODUCT_COLUMNS.map((col) => (
            <div key={col.title} className="relative flex min-w-0 flex-1 flex-col items-start gap-[8px]">
              <div className="relative flex flex-row items-center gap-[10px]">
                <Eyebrow>{col.title}</Eyebrow>
                {col.titleComingSoon && <ComingSoon className="right-[-133px] top-[-2px]" />}
              </div>
              {col.items.map((item) => <AgentItem key={item.title} item={item} />)}
              {col.comingSoon && <ComingSoon className="bottom-[32px] right-[41px]" />}
            </div>
          ))}
          <div className="flex min-w-0 flex-1 flex-col items-start gap-[16px]">
            <Eyebrow>Capabilities</Eyebrow>
            <div className="mm-cluster">
              <div className="flex w-full flex-col items-start gap-[29px]">
                {CAPABILITIES.map((c) => (
                  <div key={c.title} className="relative flex w-full flex-col items-start gap-[10px]">
                    <IconLink href={c.href} icon={c.icon} gap="12px">{c.title}</IconLink>
                    <p className="text-[14px] leading-[15.4px] text-ink-2">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <MenuFooter />
    </>
  )
}

function MenuFooter() {
  return (
    <div className="flex w-full flex-col items-center gap-[24px] px-[16px] py-[24px]">
      <div className="h-px w-full bg-sand-line" />
      <div className="flex w-full flex-row items-center justify-between">
        <UnderlineLink
          href={INTEGRATIONS_HREF}
          className="flex flex-row items-center gap-[4px]"
          labelClassName="text-[16px] font-medium leading-[16px] text-ink-3"
          before={<span className="font-fa text-[16px] leading-[16px] text-icon-grey">{VIEW_INTEGRATIONS_ICON}</span>}
        >
          View Integrations
        </UnderlineLink>
        <div className="flex flex-row items-center gap-[10px]">
          <p className="text-[14px] leading-[15.4px] text-ink-2">Works with</p>
          {WORKS_WITH.map((t) => (
            <div key={t} className="mm-tag">{t}</div>
          ))}
          <UnderlineLink href={INTEGRATIONS_HREF} labelClassName="text-[16px] font-medium leading-[16px] text-ink-3">
            + more
          </UnderlineLink>
        </div>
      </div>
    </div>
  )
}

function BlogCard({ post }) {
  return (
    <a href={post.href} className="flex h-full min-w-[210px] max-w-[320px] flex-1 flex-col overflow-hidden p-[2px]">
      <div className="flex h-full w-full flex-col overflow-hidden rounded-[22px] bg-hero-bg">
        <img src={post.image} alt="" className="aspect-[1.74863] w-full flex-none object-cover" />
        <div className="flex min-h-0 flex-1 flex-col items-start gap-[24px] overflow-hidden p-[24px]">
          <div className="flex w-full flex-row items-center gap-[8px] overflow-hidden">
            <div className="flex flex-row items-center gap-[5px]">
              {post.avatars.map((a) => (
                <img key={a} src={a} alt="" className="h-[30px] w-[30px] rounded-[50px] object-cover" />
              ))}
            </div>
            <div className="flex flex-row items-center gap-[4px] whitespace-pre">
              <span className="text-[12px] leading-[18px] text-black/50">Written by</span>
              <span className="text-[12px] font-medium leading-[18px] text-ink">Andrei Negrau</span>
            </div>
          </div>
          <p className="h-[140px] w-full overflow-hidden font-serif text-[20px] leading-[28px] text-black">{post.title}</p>
        </div>
      </div>
    </a>
  )
}

export function ResourcesPanel() {
  return (
    <div className="flex h-full flex-col px-[8px] py-[24px]">
      <div className="flex min-h-0 w-full flex-1 flex-row items-start gap-[32px]">
        <div className="flex w-[261px] flex-none flex-col items-start gap-[16px]">
          <Eyebrow>Resources</Eyebrow>
          <div className="mm-cluster">
            <div className="flex w-full flex-col items-start gap-[29px]">
              {RESOURCE_LINKS.map((l) => (
                <IconLink key={l.title} href={l.href} icon={l.icon} gap="12px">{l.title}</IconLink>
              ))}
            </div>
          </div>
        </div>
        <div className="flex h-full min-w-0 flex-1 flex-col items-start gap-[10px]">
          <Eyebrow>Latest blog posts</Eyebrow>
          <div className="flex min-h-0 w-full flex-1 flex-row flex-wrap content-start justify-center gap-[16px] overflow-clip">
            {BLOG_POSTS.map((p) => <BlogCard key={p.title} post={p} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
