/**
 * Stashed About-page team entries.
 *
 * These people are NOT shown on the site right now. Their entries are kept
 * here, verbatim, so they can be put back on the About page later.
 *
 * To restore an entry: paste its `bio` JSX block back into
 * src/pages/public/Methodology.tsx inside "The Team" section, in the position
 * noted below. Nothing imports this file, so it has no effect on the live site.
 */

export const stashedTeamMembers = [
  {
    name: "Geli Juani",
    role: "Co-Founder and Research Editor",
    hiddenOn: "2026-11-11",
    restorePosition: "after Cha Crisostomo, before Erwin Daez",
    bio: `
            <div>
              <h3 className="font-bold text-black text-lg mb-1">Geli Juani</h3>
              <p className="text-gray-600 font-medium uppercase tracking-wide text-xs mb-3">Co-Founder and Research Editor</p>
              <p className="text-lg text-gray-600 leading-relaxed mb-3">
                Geli is a policy and quantitative analyst based in New York City. Her work sits at the intersection of technology and geoeconomics, with research spanning artificial intelligence and energy systems, cybersecurity, and global economic governance. She has experience tracking and analyzing competitiveness, investment climate, global value chains, and labor and poverty indicators, including through work on Arangkada Philippines and with multilateral institutions such as the Asian Development Bank and the World Bank. She holds a master's degree in economics from the University of the Philippines and a master's degree in global human development from Georgetown University.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Outside her day job, Geli helps build and maintain the Mamdani Tracker, contributing research, verification, and updates. In her spare time, she enjoys reading, creative writing, cooking, and long walks around the city.
              </p>
            </div>
`,
  },
];
