import { useState,useRef } from 'react';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

const STEPS = [
  { label: 'About you', fields: ['name', 'email'] },
  { label: 'Your project', fields: ['service', 'scope'] },
  { label: 'Details', fields: ['message'] }
];

const SERVICE_OPTIONS = [
  'Website / landing page',
  'Web app / e-commerce',
  'Android app',
  'UI/UX design',
  'Digital marketing',
  'Other'
];

const SCOPE_OPTIONS = [
  'Under ₹25,000',
  '₹25,000 – ₹75,000',
  '₹75,000 – ₹2,00,000',
  '₹2,00,000+'
];

const COLORS = {
  primary:"#A0DB21",
  primaryDark:"#8CC31D",
  primaryLight:"#B6E85A",
  bg:"#0B0D08",
  surface:"#12150F",
  border:"#2B351C",
  borderHover:"#4C6522",
  text:"#F4F9E8",
  textMuted:"#B8C7A0",
  textFaint:"#7F8F6A",
  error:"#FF607A"
};

export default function ContactForm({ accent = COLORS.primary, onSuccess, prefillService ,theme,C}) {
  const [step, setStep] = useState(0);
  const [vals, setVals] = useState({
    name: '',
    email: '',
    service: prefillService || '',
    scope: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setVals(p => ({ ...p, [k]: v }));
function MagneticButton({ children, onClick, style = {} }) {
  const ref = useRef();

  const handleMove = e => {
    const rect = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.35;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.35;
    ref.current.style.transform = `translate(${dx}px, ${dy}px) scale(1.04)`;
  };

  const handleLeave = () => {
    ref.current.style.transform = "translate(0px, 0px) scale(1)";
  };

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transition: "transform 0.25s cubic-bezier(0.23,1,0.32,1)",
        cursor: "pointer",
        border: "none",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
  const canNext = () => {
    if (step === 0) return vals.name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email);
    if (step === 1) return vals.service //&& vals.scope;
    if (step === 2) return vals.message.trim().length >= 10;
    return true;
  };

  const submit = async () => {
    setSending(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vals)
      });
      const data = await res.json();
      if (data.success) onSuccess();
      else setError('Server error — please call or email us directly.');
    } catch {
      setError('Could not connect — please call or email us directly.');
    }
    setSending(false);
  };

  const inputStyle = {
    width: '100%',
    background: 'transparent',
    border: `1px solid ${COLORS.border}`,
    color: C.text,
    padding: '14px 16px',
    borderRadius: '12px',
    fontSize: '0.93rem',
     outline: 'none'
  };

  const focusStyle = `input:focus,textarea:focus{border-color:${accent}!important;box-shadow:0 0 0 3px ${accent}15;}`;

  return (
    <div>
      <style>{focusStyle}</style>

      {/* Progress Steps Indicators */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ flex: 1 }}>
            <div
              style={{
                height: '3px',
                borderRadius: '2px',
                background: i <= step ? accent : COLORS.border,
                transition: `background 0.4s ${EASE}`,
                marginBottom: '6px'
              }}
            />
            <div
              style={{
                fontSize: '0.7rem',
                color: i === step ? accent : COLORS.textFaint,
                 transition: 'color 0.3s'
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Step 0: User Info */}
      {step === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            {/* <label style={{ fontSize: '0.75rem', color: COLORS.textFaint, display: 'block', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '1px',  }}>
              Your name
            </label> */}
            <input
              value={vals.name}
              onChange={e => set('name', e.target.value)}
              placeholder="your name"
              style={inputStyle}
            />
          </div>
          <div>
            {/* <label style={{ fontSize: '0.75rem', color: COLORS.textFaint, display: 'block', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '1px',  }}>
              Email address
            </label> */}
            <input
              type="email"
              value={vals.email}
              onChange={e => set('email', e.target.value)}
              placeholder="your email"
              style={inputStyle}
            />
          </div>
        </div>
      )}

      {/* Step 1: Project & Budget Scope */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: COLORS.textFaint, display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px',  }}>
              What do you need?
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {SERVICE_OPTIONS.map(o => (
                <button
                  key={o}
                  onClick={() => set('service', o)}
                  style={{
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: `1px solid ${vals.service === o ? accent : COLORS.border}`,
                    background: vals.service === o ? `${accent}12` : 'transparent',
                    color: vals.service === o ? accent : COLORS.textMuted,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: '"Inter",sans-serif',
                    transition: `all 0.2s ${EASE}`
                  }}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
          {/* <div>
            <label style={{ fontSize: '0.75rem', color: COLORS.textFaint, display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px',  }}>
              Approximate budget
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {SCOPE_OPTIONS.map(o => (
                <button
                  key={o}
                  onClick={() => set('scope', o)}
                  style={{
                    padding: '9px 14px',
                    borderRadius: '9px',
                    border: `1px solid ${vals.scope === o ? accent : COLORS.border}`,
                    background: vals.scope === o ? `${accent}12` : 'transparent',
                    color: vals.scope === o ? accent : COLORS.textMuted,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    fontFamily: '"Inter",sans-serif',
                    transition: `all 0.2s ${EASE}`
                  }}
                >
                  {o}
                </button>
              ))}
            </div>
          </div> */}
        </div>
      )}

      {/* Step 2: Message Details */}
      {step === 2 && (
        <div>
          <label style={{ fontSize: '0.75rem', color: COLORS.textFaint, display: 'block', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '1px',  }}>
            Tell us more
          </label>
          <textarea
            value={vals.message}
            onChange={e => set('message', e.target.value)}
            placeholder="Describe your project, goals, or any questions you have…"
            rows={6}
            style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
          />
          <div
            style={{
              fontSize: '0.75rem',
              color: vals.message.length < 10 ? COLORS.textFaint : accent,
              marginTop: '6px',
               
              transition: 'color 0.3s'
            }}
          >
            {vals.message.length} chars {vals.message.length < 10 ? `· ${10 - vals.message.length} more needed` : '· good to go'}
          </div>
          {error && (
            <div
              style={{
                color: '#ff607a',
                fontSize: '0.85rem',
                marginTop: '12px',
                background: 'rgba(255,96,122,0.06)',
                border: '1px solid rgba(255,96,122,0.2)',
                padding: '12px 14px',
                borderRadius: '10px'
              }}
            >
              {error}
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '24px', gap: '10px' }}>

        {step > 0 ? (
           <MagneticButton

              onClick={() => setStep(s => s - 1)}
            style={{
              background: 'transparent',
              border: `1px solid ${COLORS.borderHover}`,
              color: COLORS.textFaint,
              padding: '12px 20px',
              borderRadius: '100px',
              cursor: 'pointer',
              fontSize: '0.88rem',
              fontFamily: '"Inter",sans-serif'
            }}
          >
          
          
            ← Back
          </MagneticButton>
        ) : (
          <div />
        )}

        {step < STEPS.length - 1 ? (
          <MagneticButton
            onClick={() => canNext() && setStep(s => s + 1)}
            style={{
              background: accent,//canNext() ? accent : COLORS.border,
              color:  '#07080f',//        canNext() ? '#07080f' : COLORS.textFaint,
              border: 'none',
              padding: '12px 28px',
              borderRadius: '100px',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: canNext() ? 'pointer' : 'default',
              fontFamily: '"Inter",sans-serif',
              transition: `all 0.25s ${EASE}`
            }}
          >
            Next →
          </MagneticButton>
        ) : (
          <MagneticButton
            onClick={() => canNext() && !sending && submit()}
            style={{
              background: canNext() && !sending ? accent : COLORS.border,
              color: canNext() && !sending ? '#07080f' : COLORS.textFaint,
              border: 'none',
              padding: '12px 28px',
              borderRadius: '100px',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: canNext() && !sending ? 'pointer' : 'default',
              fontFamily: '"Inter",sans-serif',
              transition: `all 0.25s ${EASE}`
            }}
          >
            {sending ? 'Sending…' : 'Send message →'}
          </MagneticButton>
        )}
      </div>
    </div>
  );
}