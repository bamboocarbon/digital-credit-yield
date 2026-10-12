// Strategy's two dollar pots and where the money flows. Shared by the STRC hub and the
// 'Second Cash Pot' blog article. Figures are as at 27 September 2026 (Strategy 8-K).
export default function StrategyCashPotsDiagram() {
  return (
    <div style={{ margin: '2rem 0', overflowX: 'auto' }}>
        <svg viewBox="0 0 560 552" width="100%" style={{ maxWidth: '560px', display: 'block', margin: '0 auto' }}>
          <defs>
            <marker id="n-gray" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#64748b" /></marker>
            <marker id="n-gold" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#f59e0b" /></marker>
            <marker id="n-green" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#22c55e" /></marker>
            <marker id="n-purple" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#8b5cf6" /></marker>
            <marker id="n-cyan" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#22d3ee" /></marker>
          </defs>
  
          <rect x="3" y="3" width="554" height="546" rx="8" fill="none" stroke="#f59e0b" strokeWidth="3" />
          <text x="280" y="26" textAnchor="middle" fontSize="12" fill="#f59e0b" fontWeight="700" letterSpacing="1.5">NOW · FIGURES AT 27 SEPTEMBER 2026</text>
  
          {/* Capital Markets */}
          <rect x="220" y="38" width="120" height="32" rx="5" fill="#1e293b" stroke="#475569" strokeWidth="1.2" />
          <text x="280" y="59" textAnchor="middle" fontSize="11" fill="#cbd5e1" fontWeight="600">Capital Markets</text>
          <line x1="248" y1="70" x2="160" y2="90" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#n-gray)" />
          <line x1="312" y1="70" x2="400" y2="90" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#n-gray)" />
  
          {/* Strategy */}
          <rect x="75" y="92" width="130" height="46" rx="5" fill="#1e293b" stroke="#475569" strokeWidth="1.2" />
          <text x="140" y="111" textAnchor="middle" fontSize="11" fill="#cbd5e1" fontWeight="600">Strategy</text>
          <text x="140" y="128" textAnchor="middle" fontSize="9.5" fill="#64748b">MSTR</text>
  
          {/* Preferred Issues */}
          <rect x="355" y="92" width="130" height="54" rx="5" fill="#1e293b" stroke="#475569" strokeWidth="1.2" />
          <text x="420" y="111" textAnchor="middle" fontSize="10.5" fill="#cbd5e1" fontWeight="600">Preferred Issues</text>
          <text x="420" y="128" textAnchor="middle" fontSize="9.5" fill="#94a3b8">STRC · STRD</text>
          <text x="420" y="141" textAnchor="middle" fontSize="9.5" fill="#94a3b8">STRK · STRF</text>
  
          {/* Buybacks -> Strategy / Preferred */}
          <line x1="225" y1="170" x2="182" y2="140" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#n-purple)" />
          <line x1="335" y1="170" x2="380" y2="148" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#n-purple)" />
  
          {/* Buybacks */}
          <rect x="205" y="170" width="150" height="56" rx="5" fill="#1a1a2e" stroke="#8b5cf6" strokeWidth="1.8" />
          <text x="280" y="189" textAnchor="middle" fontSize="11" fill="#c4b5fd" fontWeight="700">Buybacks</text>
          <text x="280" y="204" textAnchor="middle" fontSize="9" fill="#a78bfa">STRC: $1.28bn in 10 weeks</text>
          <text x="280" y="216" textAnchor="middle" fontSize="8.5" fill="#a78bfa">now funded from USD Cash</text>
  
          {/* Strategy / Preferred -> Bitcoin */}
          <line x1="105" y1="138" x2="215" y2="248" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#n-gray)" />
          <line x1="455" y1="146" x2="345" y2="248" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#n-gray)" />
  
          {/* Bitcoin -> Buybacks */}
          <line x1="280" y1="250" x2="280" y2="230" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#n-gold)" />
  
          {/* Bitcoin Stack */}
          <rect x="190" y="250" width="180" height="50" rx="5" fill="#1a1f2e" stroke="#f59e0b" strokeWidth="1.8" />
          <text x="280" y="270" textAnchor="middle" fontSize="12" fill="#fde047" fontWeight="700">Bitcoin Stack</text>
          <text x="280" y="288" textAnchor="middle" fontSize="10" fill="#f59e0b">847,666 BTC · active capital</text>
  
          {/* Bitcoin -> USD Reserve */}
          <line x1="345" y1="300" x2="410" y2="338" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#n-gold)" />
          {/* USD Cash -> Bitcoin */}
          <line x1="180" y1="338" x2="225" y2="302" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#n-cyan)" />
  
          {/* USD Cash (NEW) */}
          <rect x="40" y="340" width="190" height="66" rx="5" fill="#083344" stroke="#22d3ee" strokeWidth="1.8" />
          <text x="135" y="361" textAnchor="middle" fontSize="11" fill="#67e8f9" fontWeight="700">USD Cash</text>
          <text x="135" y="377" textAnchor="middle" fontSize="9.5" fill="#22d3ee">$1.00bn · flexible</text>
          <text x="135" y="392" textAnchor="middle" fontSize="8.5" fill="#22d3ee">buybacks · Bitcoin · top-ups</text>
          <rect x="184" y="331" width="38" height="14" rx="3" fill="#22d3ee" />
          <text x="203" y="341.5" textAnchor="middle" fontSize="8.5" fill="#083344" fontWeight="800">NEW</text>
  
          {/* USD Cash -> Buybacks (left margin) */}
          <path d="M 40 373 L 16 373 L 16 198 L 203 198" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#n-cyan)" />
  
          {/* USD Reserve */}
          <rect x="330" y="340" width="190" height="66" rx="5" fill="#052e16" stroke="#22c55e" strokeWidth="1.8" />
          <text x="425" y="361" textAnchor="middle" fontSize="11" fill="#86efac" fontWeight="700">USD Reserve</text>
          <text x="425" y="377" textAnchor="middle" fontSize="9.5" fill="#4ade80">$5.02bn · ring-fenced</text>
          <text x="425" y="392" textAnchor="middle" fontSize="8.5" fill="#4ade80">preferred divs + interest only</text>
  
          {/* USD Reserve -> Preferred (right margin) */}
          <path d="M 520 373 L 541 373 L 541 120 L 487 120" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#n-green)" />
  
          {/* Notes + legend */}
          <text x="280" y="432" textAnchor="middle" fontSize="9" fill="#6b7280">MSTR share sales (the ATM) top up both pots. Reserve policy unchanged.</text>
          <text x="280" y="446" textAnchor="middle" fontSize="9" fill="#6b7280">Balances include some cash from share sales not yet settled.</text>
          <text x="280" y="468" textAnchor="middle" fontSize="9" fill="#4b5563">── Gray: capital markets / issuance</text>
          <text x="280" y="482" textAnchor="middle" fontSize="9" fill="#f59e0b">- - Gold dashed: BTC monetisation (board-authorised)</text>
          <text x="280" y="496" textAnchor="middle" fontSize="9" fill="#22c55e">- - Green dashed: USD Reserve → preferred dividends</text>
          <text x="280" y="510" textAnchor="middle" fontSize="9" fill="#22d3ee">- - Cyan dashed: USD Cash → buybacks and Bitcoin purchases</text>
          <text x="280" y="524" textAnchor="middle" fontSize="9" fill="#8b5cf6">- - Purple dashed: buyback repurchases</text>
        </svg>
    </div>
  );
}
