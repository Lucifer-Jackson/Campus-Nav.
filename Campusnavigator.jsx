import React, { useState, useRef, useEffect } from 'react';
import { Navigation, MapPin, ArrowRight, ChevronDown } from 'lucide-react';

// --- CUSTOM SELECT COMPONENT ---
const CustomSelect = ({ label, icon: Icon, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.id === value);

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <label style={{ 
        display: 'block', 
        fontSize: '12px', 
        fontWeight: '800', 
        color: '#475569', 
        textTransform: 'uppercase', 
        letterSpacing: '1px', 
        marginBottom: '8px', 
        marginLeft: '4px',
        textShadow: '0 1px 2px rgba(255,255,255,0.8)'
      }}>
        {label}
      </label>
      
      <div style={{ position: 'relative' }}>
        {/* Trigger Button */}
        <div 
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '100%',
            padding: '16px 16px 16px 48px',
            background: isOpen ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.6)', 
            border: isOpen ? '2px solid #6366f1' : '2px solid rgba(255,255,255, 0.5)',
            borderRadius: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.2s ease',
            boxShadow: isOpen ? '0 4px 12px rgba(99, 102, 241, 0.2)' : 'none',
            boxSizing: 'border-box',
            backdropFilter: 'blur(4px)'
          }}
        >
          <Icon size={20} color={isOpen ? '#6366f1' : '#475569'} style={{ position: 'absolute', left: '16px' }} />
          
          <span style={{ 
            color: '#1e293b', 
            fontWeight: '600',
            fontSize: '15px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {selectedOption ? selectedOption.name : "Select Location"}
          </span>
          
          <ChevronDown 
            size={18} 
            color="#64748b" 
            style={{ 
              transition: 'transform 0.2s', 
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              flexShrink: 0 
            }} 
          />
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)',
            border: '1px solid #f1f5f9',
            maxHeight: '280px',
            overflowY: 'auto',
            zIndex: 100,
            padding: '8px'
          }}>
            {options.map((opt) => {
              const isSelected = opt.id === value;
              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    onChange(opt.id);
                    setIsOpen(false);
                  }}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '2px',
                    background: isSelected ? '#eff6ff' : 'transparent',
                    color: isSelected ? '#4f46e5' : '#475569',
                    fontWeight: isSelected ? '600' : '400',
                    transition: 'background 0.1s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {opt.name}
                  {isSelected && <span style={{color: '#4f46e5', fontWeight: 'bold'}}>✓</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN NAVIGATOR COMPONENT ---
const CampusNavigator = () => {
  const buildings = [
    { id: 0, name: "Tuck Shop" }, 
    { id: 1, name: "Coffee House" },
    { id: 2, name: "BTech Block" }, 
    { id: 3, name: "Happiness Hut" },
    { id: 4, name: "Ravi Canteen" }, 
    { id: 5, name: "Badminton Court" },
    { id: 6, name: "Civil Block" }, 
    { id: 7, name: "Basketball Court" },
    { id: 8, name: "Santoshanand Library" }, 
    { id: 9, name: "Digital Lab" },
    { id: 10, name: "Aryabhatta Lab" }, 
    { id: 11, name: "Param Lab" },
    { id: 12, name: "Petroleum Block" }, 
    { id: 13, name: "Mechanical Block" },
    { id: 14, name: "Quick Bite Cafe" }, 
    { id: 15, name: "Chanakya Block" },
    { id: 16, name: "KP Nautiyal Block" },
    // NEW ADDITIONS
    { id: 17, name: "Gate 2 Bus Stop" },
    { id: 18, name: "Gate 1" }, 
    { id: 19, name: "Gate 2" }, 
    { id: 20, name: "Convention Center" },
    { id: 21, name: "Gate 1 Bus Stop" }, 
    { id: 22, name: "CSIT Gate" }
  ];

  // UPDATED MATRIX SIZE: Now up to 23 (0-22)
  const adjMatrix = Array(23).fill(null).map(() => Array(23).fill(0));
  
  const edges = [
    // Old Edges
    [0, 1, 19], [1, 2, 101], [1, 3, 161], [2, 3, 70], [2, 5, 84],
    [2, 8, 71], [2, 9, 71], [2, 10, 56], [3, 4, 12], [3, 5, 68],
    [5, 6, 13], [6, 7, 52], [6, 8, 86], [6, 9, 86], [7, 8, 54],
    [7, 9, 54], [8, 10, 32], [8, 11, 27], [9, 10, 32], [9, 11, 27],
    [10, 11, 37], [10, 12, 91], [10, 13, 66], [11, 13, 57], [11, 12, 53],
    [12, 13, 62], [12, 14, 21], [14, 15, 31], [14, 16, 29], [15, 16, 12],
    // New Edges
    [18, 0, 24], [18, 20, 105], [18, 22, 91], [2, 22, 214], [3, 22, 173],
    [16, 17, 75], [19, 17, 41], [19, 21, 308], [20, 21, 185]
  ];

  edges.forEach(([src, dest, dist]) => {
    adjMatrix[src][dest] = dist;
    adjMatrix[dest][src] = dist;
  });

  const [startId, setStartId] = useState(0);
  const [endId, setEndId] = useState(14);
  const [result, setResult] = useState(null);

  const dijkstra = (start, end) => {
    const n = buildings.length;
    const distances = Array(n).fill(Infinity);
    const visited = Array(n).fill(false);
    const parent = Array(n).fill(-1);
    distances[start] = 0;

    for (let count = 0; count < n - 1; count++) {
      let u = -1;
      let min = Infinity;
      for (let v = 0; v < n; v++) {
        if (!visited[v] && distances[v] <= min) {
          min = distances[v];
          u = v;
        }
      }
      if (u === -1 || u === end) break;
      visited[u] = true;

      for (let v = 0; v < n; v++) {
        if (!visited[v] && adjMatrix[u][v] && distances[u] !== Infinity &&
            distances[u] + adjMatrix[u][v] < distances[v]) {
          parent[v] = u;
          distances[v] = distances[u] + adjMatrix[u][v];
        }
      }
    }
    const path = [];
    let current = end;
    while (current !== -1) {
      path.unshift(current);
      current = parent[current];
    }
    return { distance: distances[end], path: distances[end] === Infinity ? [] : path };
  };

  const findPath = () => {
    setResult(dijkstra(startId, endId));
  };

  // --- STYLES ---
  const styles = {
    container: {
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(45deg, #4f46e5, #ec4899)', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.75)', 
      backdropFilter: 'blur(20px)',           
      WebkitBackdropFilter: 'blur(20px)',     
      border: '1px solid rgba(255, 255, 255, 0.4)', 
      width: '100%',
      maxWidth: '800px',
      borderRadius: '24px',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', 
    },
    header: {
      padding: '30px',
      borderBottom: '1px solid rgba(0,0,0,0.05)',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
    },
    iconBox: {
      background: '#4f46e5',
      padding: '10px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)',
    },
    content: {
      padding: '30px',
    },
    inputContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
      marginBottom: '10px',
    },
    inputWrapper: {
      flex: '1 1 250px',
      minWidth: '0',
    },
    button: {
      width: '100%',
      padding: '16px',
      marginTop: '10px',
      background: '#1e293b',
      color: 'white',
      border: 'none',
      borderRadius: '16px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: '0 4px 15px rgba(30, 41, 59, 0.3)',
    },
    resultSection: {
      background: 'rgba(255, 255, 255, 0.4)', 
      padding: '30px',
      borderTop: '1px solid rgba(255, 255, 255, 0.4)',
      borderBottomLeftRadius: '24px',
      borderBottomRightRadius: '24px',
    },
    resultHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      fontSize: '12px',
      fontWeight: '800',
      color: '#475569',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    distanceBadge: {
      background: 'white',
      padding: '6px 16px',
      borderRadius: '20px',
      color: '#4f46e5',
      fontWeight: 'bold',
      fontSize: '14px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    },
    pathContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      alignItems: 'center',
    },
    pathItem: {
      background: '#4f46e5',
      color: 'white',
      padding: '10px 18px',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 4px 6px rgba(79, 70, 229, 0.3)',
    },
    pathItemEnd: {
      background: '#1e293b',
      color: 'white',
      padding: '10px 18px',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 4px 6px rgba(30, 41, 59, 0.3)',
    },
    arrow: {
      color: '#475569', 
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconBox}>
            <Navigation size={24} color="white" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', color: '#1e293b' }}>Campus Navigator</h1>
            <p style={{ margin: '4px 0 0', color: '#475569', fontSize: '14px', fontWeight: '500' }}>Find the quickest route</p>
          </div>
        </div>

        {/* Input Form */}
        <div style={styles.content}>
          <div style={styles.inputContainer}>
            <div style={styles.inputWrapper}>
              <CustomSelect 
                label="Start Point"
                icon={MapPin}
                options={buildings}
                value={startId}
                onChange={setStartId}
              />
            </div>

            <div style={styles.inputWrapper}>
              <CustomSelect 
                label="Destination"
                icon={Navigation}
                options={buildings}
                value={endId}
                onChange={setEndId}
              />
            </div>
          </div>

          <button 
            onClick={findPath} 
            style={styles.button}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Calculate Route
          </button>
        </div>

        {/* Results */}
        {result && (
          <div style={styles.resultSection}>
            {result.path.length > 0 ? (
              <div>
                <div style={styles.resultHeader}>
                  <span style={styles.label}>Optimized Path</span>
                  <div style={styles.distanceBadge}>
                    {result.distance}m total
                  </div>
                </div>

                <div style={styles.pathContainer}>
                  {result.path.map((buildingId, idx) => {
                    const isEnd = idx === result.path.length - 1;
                    return (
                      <React.Fragment key={buildingId}>
                        <div style={isEnd ? styles.pathItemEnd : styles.pathItem}>
                          {buildings[buildingId].name}
                        </div>
                        {!isEnd && <ArrowRight size={20} style={styles.arrow} />}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#ef4444', padding: '20px', background: 'rgba(254, 242, 242, 0.8)', borderRadius: '10px' }}>
                No path found between these locations.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CampusNavigator;