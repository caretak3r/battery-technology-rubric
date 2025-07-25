import React, { useState, useMemo } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChevronDown, ChevronUp, PlusCircle, Trash2, BatteryCharging, Factory, TestTube, BrainCircuit } from 'lucide-react';

// --- Rubric Data ---
const rubricData = {
  categories: [
    {
      id: 'tech',
      title: 'Technological & Scientific Prowess',
      icon: <BrainCircuit className="w-6 h-6 mr-2" />,
      criteria: [
        { id: '1.1', title: 'Novelty of Core Architecture', descriptions: ['Incremental Li-ion tweak', 'Novel component, conventional architecture', 'Fundamentally new architecture (e.g., anode-less)', 'New architecture with novel electrolyte', 'Transformational paradigm shift'] },
        { id: '1.2', title: 'Intellectual Property (IP) Moat', descriptions: ['Few, narrow patents', 'Portfolio on specific components', 'Broad patents on core architecture', 'Patents cited as fundamental by others', 'Dominant, defensible IP portfolio'] },
        { id: '1.3', title: 'Materials Science & Supply Chain', descriptions: ['Relies on standard/constrained materials', 'R&D to reduce constrained materials', 'Designs proprietary materials', 'Secured supply chain for proprietary materials', 'Commercialized new, superior material'] },
        { id: '1.4', title: 'R&D Velocity & Agility', descriptions: ['Single research pathway', 'Exploring 2-3 related vectors', 'Able to pivot/integrate discoveries', 'Structured Gen 2/3 R&D pipeline', 'Functions like a top research institution'] },
      ]
    },
    {
      id: 'manufacturing',
      title: 'Manufacturing & Process Engineering',
      icon: <Factory className="w-6 h-6 mr-2" />,
      criteria: [
        { id: '2.1', title: 'Process Scalability & Yield', descriptions: ['Manual, bench-top process', 'Semi-automated, low yield (<50%)', 'Automated pilot line, improving yield', 'Large pilot line, >95% yield', 'High-volume, >99.9% yield (DPMO)'] },
        { id: '2.2', title: 'Manufacturing Innovation', descriptions: ['Uses off-the-shelf equipment', 'Modifies existing equipment', 'Builds custom single-station equipment', 'Novel end-to-end process (e.g., dry electrode)', 'Process/equipment is a licensable product'] },
        { id: '2.3', title: 'Quality Control & Data Integration', descriptions: ['Manual post-production testing', 'Automated post-production testing', 'In-line metrology and data collection', 'Digital twin, predictive AI/ML', 'Fully integrated, closed-loop AI control'] },
        { id: '2.4', title: 'Cell Formation & Aging', descriptions: ['Slow, energy-intensive bottleneck', 'Process defined but not optimized', 'Optimized on pilot scale', 'Novel techniques reduce time/cost', 'Formation radically shortened or eliminated'] },
      ]
    },
    {
      id: 'performance',
      title: 'Performance, Safety & Validation',
      icon: <TestTube className="w-6 h-6 mr-2" />,
      criteria: [
        { id: '3.1', title: 'Core Performance Metrics', descriptions: ['Claims are theoretical', 'A-samples exist, metrics lag', 'C-samples meet/exceed on one metric', '3rd-party validated, exceeds on multiple metrics', 'Mass-produced, demonstrably outperforms all'] },
        { id: '3.2', title: 'Safety & Reliability', descriptions: ['Safety is theoretical', 'Basic abuse testing on small cells', 'Passes UN 38.3, thermal runaway modeled', 'Superior safety in extreme abuse tests', 'Inherently safe, eliminates pack-level systems'] },
        { id: '3.3', title: 'Customer Validation & Adoption', descriptions: ['No external partnerships', 'Research collaboration', 'Joint Development Agreement (JDA) with OEM', 'Customer offtake agreements or investment', 'Multiple high-volume supply contracts'] },
      ]
    }
  ]
};

// --- Initial State for Companies ---
const initialCompanies = [
  {
    id: 'tesla',
    name: 'Tesla',
    logo: 'https://placehold.co/40x40/1F2937/FFFFFF?text=T',
    scores: { '1.1': 3, '1.2': 3, '1.3': 4, '1.4': 4, '2.1': 4, '2.2': 5, '2.3': 4, '2.4': 4, '3.1': 5, '3.2': 4, '3.3': 5 },
  },
  {
    id: 'quantumscape',
    name: 'QuantumScape',
    logo: 'https://placehold.co/40x40/1F2937/FFFFFF?text=Q',
    scores: { '1.1': 5, '1.2': 4, '1.3': 4, '1.4': 4, '2.1': 3, '2.2': 3, '2.3': 2, '2.4': 2, '3.1': 3, '3.2': 4, '3.3': 4 },
  },
  {
    id: 'solidpower',
    name: 'Solid Power',
    logo: 'https://placehold.co/40x40/1F2937/FFFFFF?text=S',
    scores: { '1.1': 4, '1.2': 3, '1.3': 4, '1.4': 3, '2.1': 3, '2.2': 4, '2.3': 3, '2.4': 3, '3.1': 3, '3.2': 4, '3.3': 4 },
  },
];

// --- Helper Functions ---
const getScoreColor = (score) => {
  return [
    'bg-slate-600', 'bg-red-500', 'bg-orange-500',
    'bg-yellow-500', 'bg-lime-500', 'bg-green-500'
  ][score] || 'bg-slate-700';
};

const calculateScores = (scores) => {
  const categoryScores = { tech: [], manufacturing: [], performance: [] };
  let totalScores = [];

  for (const key in scores) {
    const score = scores[key];
    if (key.startsWith('1.')) categoryScores.tech.push(score);
    else if (key.startsWith('2.')) categoryScores.manufacturing.push(score);
    else if (key.startsWith('3.')) categoryScores.performance.push(score);
    totalScores.push(score);
  }

  const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  return {
    tech: avg(categoryScores.tech),
    manufacturing: avg(categoryScores.manufacturing),
    performance: avg(categoryScores.performance),
    overall: avg(totalScores),
  };
};

// --- Components ---
const ScoreVisualization = ({ companies }) => {
    const chartData = useMemo(() => {
        const categories = [
            { name: 'Tech', dataKey: 'tech' },
            { name: 'Manufacturing', dataKey: 'manufacturing' },
            { name: 'Performance', dataKey: 'performance' },
        ];

        return categories.map(category => {
            const entry = { subject: category.name };
            companies.forEach(company => {
                const calculated = calculateScores(company.scores);
                entry[company.name] = calculated[category.dataKey];
            });
            return entry;
        });

    }, [companies]);

    if (!companies.length) return null;

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

    return (
        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Comparative Analysis Radar</h2>
            <ResponsiveContainer width="100%" height={400}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="#4A5568" />
                    <PolarAngleAxis dataKey="subject" stroke="#E2E8F0" />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} stroke="#4A5568"/>
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4A5568' }} />
                    <Legend />
                    {companies.map((company, index) => (
                        <Radar
                            key={company.id}
                            name={company.name}
                            dataKey={company.name}
                            stroke={colors[index % colors.length]}
                            fill={colors[index % colors.length]}
                            fillOpacity={0.6}
                        />
                    ))}
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

const RubricCriterion = ({ criterion, score, onScoreChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-t border-slate-600 py-3">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <h4 className="font-semibold text-slate-200 flex-1 pr-4">{criterion.title}</h4>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map(value => (
            <button
              key={value}
              onClick={(e) => {
                e.stopPropagation();
                onScoreChange(criterion.id, value);
              }}
              className={`w-7 h-7 rounded-md text-white font-bold transition-transform transform hover:scale-110 ${getScoreColor(score === value ? value : 0)} ${score === value ? 'ring-2 ring-white' : ''}`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      {isExpanded && (
        <div className="mt-3 pl-2 border-l-2 border-slate-500">
          <ul className="space-y-1">
            {criterion.descriptions.map((desc, index) => (
              <li key={index} className={`flex items-start transition-all duration-300 ${score === index + 1 ? 'text-white font-bold' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full ${getScoreColor(index + 1)} text-white text-xs font-bold flex-shrink-0 flex items-center justify-center mr-2 mt-0.5`}>{index + 1}</span>
                <span>{desc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const CompanyCard = ({ company, onScoreChange, onRemove }) => {
  const [openCategories, setOpenCategories] = useState({ tech: true, manufacturing: false, performance: false });
  const calculatedScores = useMemo(() => calculateScores(company.scores), [company.scores]);

  const toggleCategory = (id) => {
    setOpenCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
      <div className="p-4 bg-slate-700/50 flex justify-between items-center">
        <div className="flex items-center">
          <img src={company.logo} alt={`${company.name} logo`} className="w-10 h-10 rounded-full mr-4 border-2 border-slate-500" />
          <h3 className="text-xl font-bold text-white">{company.name}</h3>
        </div>
        <div className="flex items-center">
            <div className="text-right mr-4">
                <div className="text-2xl font-bold text-white">{calculatedScores.overall.toFixed(2)}</div>
                <div className="text-xs text-slate-400">Overall Score</div>
            </div>
            <button onClick={() => onRemove(company.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                <Trash2 size={20} />
            </button>
        </div>
      </div>

      <div className="p-4 grid grid-cols-3 gap-4 text-center border-b border-slate-700">
          <div>
              <div className="text-lg font-bold text-sky-400">{calculatedScores.tech.toFixed(2)}</div>
              <div className="text-xs text-slate-400">Tech</div>
          </div>
          <div>
              <div className="text-lg font-bold text-emerald-400">{calculatedScores.manufacturing.toFixed(2)}</div>
              <div className="text-xs text-slate-400">Manufacturing</div>
          </div>
          <div>
              <div className="text-lg font-bold text-amber-400">{calculatedScores.performance.toFixed(2)}</div>
              <div className="text-xs text-slate-400">Performance</div>
          </div>
      </div>

      <div className="p-4">
        {rubricData.categories.map(category => (
          <div key={category.id} className="mb-2 last:mb-0">
            <button onClick={() => toggleCategory(category.id)} className="w-full flex justify-between items-center p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
              <div className="flex items-center text-lg font-bold text-white">
                {category.icon}
                {category.title}
              </div>
              {openCategories[category.id] ? <ChevronUp /> : <ChevronDown />}
            </button>
            {openCategories[category.id] && (
              <div className="pl-4 pr-2 py-2 bg-slate-800/50 rounded-b-lg">
                {category.criteria.map(criterion => (
                  <RubricCriterion
                    key={criterion.id}
                    criterion={criterion}
                    score={company.scores[criterion.id]}
                    onScoreChange={(criterionId, newScore) => onScoreChange(company.id, criterionId, newScore)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const AddCompanyForm = ({ onAdd }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onAdd(name.trim());
            setName('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter new company name..."
                className="flex-grow bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
            <button type="submit" className="flex items-center justify-center bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                <PlusCircle size={20} className="mr-2" />
                Add Company
            </button>
        </form>
    );
};


export default function App() {
  const [companies, setCompanies] = useState(initialCompanies);

  const handleScoreChange = (companyId, criterionId, newScore) => {
    setCompanies(prevCompanies =>
      prevCompanies.map(company =>
        company.id === companyId
          ? {
              ...company,
              scores: { ...company.scores, [criterionId]: newScore },
            }
          : company
      )
    );
  };

  const handleAddCompany = (name) => {
      const newCompany = {
          id: name.toLowerCase().replace(/\s+/g, '-') + Date.now(),
          name: name,
          logo: `https://placehold.co/40x40/1F2937/FFFFFF?text=${name.charAt(0).toUpperCase()}`,
          scores: rubricData.categories.flatMap(c => c.criteria).reduce((acc, crit) => {
              acc[crit.id] = 1; // Default score
              return acc;
          }, {}),
      };
      setCompanies(prev => [...prev, newCompany]);
  };

  const handleRemoveCompany = (id) => {
      setCompanies(prev => prev.filter(c => c.id !== id));
  };


  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-2">
            <BatteryCharging className="w-12 h-12 text-green-400" />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white ml-4">
              Battery Tech Scorecard
            </h1>
          </div>
          <p className="text-lg text-slate-400">
            Evaluating the "ASML of Batteries" using the Da Vinci Rubric.
          </p>
        </div>

        <AddCompanyForm onAdd={handleAddCompany} />

        <ScoreVisualization companies={companies} />

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {companies.map(company => (
            <CompanyCard
              key={company.id}
              company={company}
              onScoreChange={handleScoreChange}
              onRemove={handleRemoveCompany}
            />
          ))}
        </div>
         {companies.length === 0 && (
            <div className="text-center col-span-full py-16 bg-slate-800 rounded-2xl">
                <h2 className="text-2xl font-bold text-white">No Companies to Evaluate</h2>
                <p className="text-slate-400 mt-2">Use the form above to add your first company.</p>
            </div>
        )}
      </div>
    </div>
  );
}
