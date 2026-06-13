
interface WorkspaceStructuredDataProps {
  name: string
  description?: string
  logo?: string
  url: string
  type?: string
}

export function WorkspaceStructuredData({
  name,
  description,
  logo,
  url,
}: WorkspaceStructuredDataProps) {
  const siteUrl = 'https://onne.chat'

  const schema = {
    '@context': 'https://schema.org',
    name,
    description: description || `Agende com ${name} online`,
    url,
    logo: logo || `${siteUrl}/android-icon-192x192.png`,
    image: logo || `${siteUrl}/android-icon-192x192.png`,
    sameAs: [url],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  )
}
