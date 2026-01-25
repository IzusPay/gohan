const stats = [
  { value: "50K+", label: "Active Servers" },
  { value: "99.99%", label: "Uptime Guarantee" },
  { value: "15+", label: "Data Centers" },
  { value: "24/7", label: "Expert Support" },
]

export function Stats() {
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground">
                {stat.value}
              </div>
              <div className="mt-2 text-sm md:text-base text-primary-foreground/80">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
