
// GestioneMenuPage.jsx
/*import React, { useState, useEffect } from 'react';
import './GestioneMenuPage.css';

export default function GestioneMenuPage() {
  const [menu, setMenu] = useState([]);
  const [nome, setNome] = useState('');
  const [prezzo, setPrezzo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [nuovaCategoria, setNuovaCategoria] = useState('');
  const [copertoAttivo, setCopertoAttivo] = useState(false);
  const [prezzoCoperto, setPrezzoCoperto] = useState('');
  const [msg, setMsg] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [modificaProdotto, setModificaProdotto] = useState(null);
  const [modificaNome, setModificaNome] = useState('');
  const [modificaPrezzo, setModificaPrezzo] = useState('');

  // Carica menu
  const caricaMenu = () => {
    fetch('https://qrcode-finale.onrender.com/api/menu')
      .then(res => res.json())
      .then(setMenu)
      .catch(() => setMenu([]));
  };

  // Carica coperto
  const caricaCoperto = () => {
    fetch('https://qrcode-finale.onrender.com/api/coperto')
      .then(res => res.json())
      .then(data => {
        setCopertoAttivo(!!data.attivo);
        setPrezzoCoperto(data.prezzo !== undefined ? data.prezzo.toString() : '');
      })
      .catch(() => {
        setCopertoAttivo(false);
        setPrezzoCoperto('');
      });
  };

  // Aggiorna coperto sul server
  const aggiornaCoperto = (attivo, prezzo) => {
    fetch('https://qrcode-finale.onrender.com/api/coperto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attivo, prezzo: prezzo ? parseFloat(prezzo) : 0 })
    });
  };

  // Toggle coperto
  const toggleCoperto = () => {
    const nuovoStato = !copertoAttivo;
    setCopertoAttivo(nuovoStato);
    aggiornaCoperto(nuovoStato, prezzoCoperto);
  };

  // Cambia prezzo coperto
  const cambiaPrezzoCoperto = (value) => {
    setPrezzoCoperto(value);
    if (copertoAttivo) aggiornaCoperto(true, value);
  };

  // Aggiungi nuovo prodotto
  const aggiungiProdotto = () => {
    const categoriaFinale = categoria === 'nuova' ? nuovaCategoria : categoria;
    if (!nome || !prezzo || !categoriaFinale) {
      alert('Compila tutti i campi');
      return;
    }

    fetch('https://qrcode-finale.onrender.com/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, prezzo: parseFloat(prezzo), categoria: categoriaFinale })
    })
      .then(() => {
        setNome('');
        setPrezzo('');
       // setCategoria('');
        setNuovaCategoria('');
        caricaMenu();
        mostraMessaggio('Prodotto aggiunto con successo!');
      });
  };

  // Messaggio temporaneo
  const mostraMessaggio = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 3000);
  };

  // Eliminazione categoria
  const eliminaCategoria = (cat) => {
    if (!window.confirm(`Sei sicuro di eliminare la categoria "${cat}" e tutti i suoi prodotti?`)) return;
    fetch(`https://qrcode-finale.onrender.com/api/categoria/${encodeURIComponent(cat)}`, { method: 'DELETE' })
      .then(() => {
        caricaMenu();
        mostraMessaggio(`Categoria "${cat}" eliminata!`);
      });
  };

  // Eliminazione prodotto
  const eliminaProdotto = (id) => {
    if (!window.confirm('Sei sicuro di eliminare questo prodotto?')) return;
    fetch(`https://qrcode-finale.onrender.com/api/menu/${id}`, { method: 'DELETE' })
      .then(() => {
        caricaMenu();
        mostraMessaggio('Prodotto eliminato!');
      });
  };

  // Apri modal modifica prodotto
  const apriModifica = (prod) => {
    setModificaProdotto(prod);
    setModificaNome(prod.nome);
    setModificaPrezzo(prod.prezzo);
    setShowModal(true);
  };

  // Salva modifica prodotto
  const salvaModifica = () => {
    fetch(`https://qrcode-finale.onrender.com/api/menu/${modificaProdotto.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: modificaNome, prezzo: parseFloat(modificaPrezzo) })
    })
      .then(() => {
        caricaMenu();
        setShowModal(false);
        mostraMessaggio('Prodotto modificato!');
      });
  };

  useEffect(() => {
    caricaMenu();
    caricaCoperto();
  }, []);

  const categorie = [...new Set(menu.map(item => item.categoria))];

  return (
    <div className="gestione-container">
      <h2>Gestione Menù</h2>

      {/* Aggiungi prodotto *//*}
      <div className="aggiungi-box">
        <h3>Aggiungi Prodotto</h3>
        <div className="aggiungi-form">
          <input type="text" placeholder="Nome pietanza" value={nome} onChange={e => setNome(e.target.value)} />
          <input type="number" placeholder="Prezzo" value={prezzo} onChange={e => setPrezzo(e.target.value)} />
          <select value={categoria} onChange={e => setCategoria(e.target.value)}>
            <option value="">Seleziona categoria</option>
            {categorie.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
            <option value="nuova">+ Nuova categoria</option>
          </select>
          {categoria === 'nuova' && (
            <input type="text" placeholder="Nuova categoria" value={nuovaCategoria} onChange={e => setNuovaCategoria(e.target.value)} />
          )}
          <button onClick={aggiungiProdotto}>Aggiungi</button>
        </div>
      </div>

      {/* Gestione coperto *//*}
      <div className="coperto-box">
        <h3>Gestione Coperto</h3>
        <label>
          <input type="checkbox" checked={copertoAttivo} onChange={toggleCoperto} />
          Attiva Coperto
        </label>
        {copertoAttivo && <input type="number" placeholder="Prezzo coperto" value={prezzoCoperto} onChange={e => cambiaPrezzoCoperto(e.target.value)} />}
      </div>

      {/* Categorie e prodotti *//*}
      <h3>Prodotti per Categoria</h3>
      {categorie.map(cat => (
        <div key={cat} className="categoria-blocco">
          <div className="categoria-header">
            <h4>{cat}</h4>
            <div className="categoria-actions">
              <button className= "elimina-cat" onClick={() => eliminaCategoria(cat)}>Elimina Categoria</button>
            </div>
          </div>
          <ul>
            {menu.filter(item => item.categoria === cat).map(item => (
              <li key={item.id}>
                {item.nome} {item.prezzo.toFixed(2)}
                <div className="prod-actions">
                  <button className="modifica" onClick={() => apriModifica(item)}>Modifica</button>
                  <button className="ordina" onClick={() => eliminaProdotto(item.id)}>Elimina</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Modal modifica prodotto *//*}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-coperto">
            <h3>Modifica Prodotto</h3>
            <input type="text" value={modificaNome} onChange={e => setModificaNome(e.target.value)} />
            <input type="number" value={modificaPrezzo} onChange={e => setModificaPrezzo(e.target.value)} />
            <div className="modal-buttons">
              <button className="ok" onClick={salvaModifica}>Salva</button>
              <button className="annulla" onClick={() => setShowModal(false)}>Chiudi</button>
            </div>
          </div>
        </div>
      )}

      {msg && <div className="msg">{msg}</div>}
    </div>
  );
}


*/



// GestioneMenuPage.jsx - VERSIONE COMPLETA MIGLIORATA
import React, { useState, useEffect, useCallback } from 'react';
import './GestioneMenuPage.css';

export default function GestioneMenuPage() {
  // Stati raggruppati per una migliore organizzazione
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState({
    nome: '',
    prezzo: '',
    categoria: '',
    nuovaCategoria: ''
  });
  const [coperto, setCoperto] = useState({
    attivo: false,
    prezzo: ''
  });
  const [ui, setUi] = useState({
    msg: '',
    loading: false,
    error: null
  });
  const [modifica, setModifica] = useState({
    show: false,
    prodotto: null,
    nome: '',
    prezzo: ''
  });

  // ✅ Funzione helper per chiamate API
  const apiCall = useCallback(async (endpoint, options = {}) => {
    const url = `https://qrcode-finale.onrender.com/api${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      
      if (!response.ok) {
        throw new Error(`Errore ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API Error ${endpoint}:`, error);
      setUi(prev => ({ 
        ...prev, 
        error: error.message,
        msg: 'Errore di connessione al server'
      }));
      throw error;
    }
  }, []);

  // ✅ Caricamento dati con gestione errori migliorata
  const caricaDati = useCallback(async () => {
    setUi(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const [menuData, copertoData] = await Promise.all([
        apiCall('/menu'),
        apiCall('/coperto')
      ]);
      
      setMenu(menuData);
      setCoperto({
        attivo: !!copertoData.attivo,
        prezzo: copertoData.prezzo !== undefined ? copertoData.prezzo.toString() : ''
      });
      
      setUi(prev => ({ ...prev, loading: false }));
    } catch (error) {
      setUi(prev => ({ 
        ...prev, 
        loading: false,
        msg: 'Errore nel caricamento dei dati'
      }));
    }
  }, [apiCall]);

  // ✅ Aggiorna coperto con validazione
  const aggiornaCoperto = useCallback(async (attivo, prezzo) => {
    const prezzoNum = prezzo ? parseFloat(prezzo) : 0;
    
    if (attivo && (isNaN(prezzoNum) || prezzoNum < 0)) {
      setUi(prev => ({ ...prev, msg: 'Inserisci un prezzo valido per il coperto' }));
      return;
    }

    try {
      await apiCall('/coperto', {
        method: 'POST',
        body: JSON.stringify({ 
          attivo, 
          prezzo: prezzoNum 
        })
      });
    } catch (error) {
      // Errore già gestito in apiCall
    }
  }, [apiCall]);

  // ✅ Toggle coperto
  const toggleCoperto = useCallback(() => {
    const nuovoStato = !coperto.attivo;
    setCoperto(prev => ({ ...prev, attivo: nuovoStato }));
    aggiornaCoperto(nuovoStato, coperto.prezzo);
  }, [coperto.attivo, coperto.prezzo, aggiornaCoperto]);

  // ✅ Cambia prezzo coperto
  const cambiaPrezzoCoperto = useCallback((value) => {
    setCoperto(prev => ({ ...prev, prezzo: value }));
    if (coperto.attivo) {
      aggiornaCoperto(true, value);
    }
  }, [coperto.attivo, aggiornaCoperto]);

  // ✅ Validazione form
  const validaForm = useCallback(() => {
    const { nome, prezzo, categoria, nuovaCategoria } = form;
    const categoriaFinale = categoria === 'nuova' ? nuovaCategoria : categoria;

    if (!nome.trim()) {
      setUi(prev => ({ ...prev, msg: 'Inserisci il nome del prodotto' }));
      return false;
    }

    const prezzoNum = parseFloat(prezzo);
    if (isNaN(prezzoNum) || prezzoNum <= 0) {
      setUi(prev => ({ ...prev, msg: 'Inserisci un prezzo valido maggiore di 0' }));
      return false;
    }

    if (!categoriaFinale.trim()) {
      setUi(prev => ({ ...prev, msg: 'Seleziona o crea una categoria' }));
      return false;
    }

    return { nome: nome.trim(), prezzo: prezzoNum, categoria: categoriaFinale.trim() };
  }, [form]);

  // ✅ Aggiungi nuovo prodotto
  const aggiungiProdotto = useCallback(async () => {
    const datiValidati = validaForm();
    if (!datiValidati) return;

    setUi(prev => ({ ...prev, loading: true }));

    try {
      await apiCall('/menu', {
        method: 'POST',
        body: JSON.stringify(datiValidati)
      });

      // Reset form
      setForm({
        nome: '',
        prezzo: '',
        categoria: '',
        nuovaCategoria: ''
      });
      
      await caricaDati();
      setUi(prev => ({ 
        ...prev, 
        msg: '✅ Prodotto aggiunto con successo!',
        loading: false 
      }));
    } catch (error) {
      setUi(prev => ({ 
        ...prev, 
        msg: '❌ Errore nell\'aggiunta del prodotto',
        loading: false 
      }));
    }
  }, [validaForm, apiCall, caricaDati]);

  // ✅ Messaggio temporaneo
  const mostraMessaggio = useCallback((text) => {
    setUi(prev => ({ ...prev, msg: text }));
    setTimeout(() => setUi(prev => ({ ...prev, msg: '' })), 3000);
  }, []);

  // ✅ Eliminazione categoria
  const eliminaCategoria = useCallback(async (cat) => {
    if (!window.confirm(`Sei sicuro di eliminare la categoria "${cat}" e tutti i suoi prodotti?`)) {
      return;
    }

    try {
      await apiCall(`/categoria/${encodeURIComponent(cat)}`, { 
        method: 'DELETE' 
      });
      
      await caricaDati();
      mostraMessaggio(`🗑️ Categoria "${cat}" eliminata!`);
    } catch (error) {
      mostraMessaggio('❌ Errore nell\'eliminazione della categoria');
    }
  }, [apiCall, caricaDati, mostraMessaggio]);

  // ✅ Eliminazione prodotto
  const eliminaProdotto = useCallback(async (id, nome) => {
    if (!window.confirm(`Sei sicuro di eliminare il prodotto "${nome}"?`)) {
      return;
    }

    try {
      await apiCall(`/menu/${id}`, { 
        method: 'DELETE' 
      });
      
      await caricaDati();
      mostraMessaggio('🗑️ Prodotto eliminato!');
    } catch (error) {
      mostraMessaggio('❌ Errore nell\'eliminazione del prodotto');
    }
  }, [apiCall, caricaDati, mostraMessaggio]);

  // ✅ Apri modal modifica prodotto
  const apriModifica = useCallback((prodotto) => {
    setModifica({
      show: true,
      prodotto,
      nome: prodotto.nome,
      prezzo: prodotto.prezzo.toString()
    });
  }, []);

  // ✅ Salva modifica prodotto
  const salvaModifica = useCallback(async () => {
    const { nome, prezzo, prodotto } = modifica;

    if (!nome.trim()) {
      setUi(prev => ({ ...prev, msg: 'Il nome non può essere vuoto' }));
      return;
    }

    const prezzoNum = parseFloat(prezzo);
    if (isNaN(prezzoNum) || prezzoNum <= 0) {
      setUi(prev => ({ ...prev, msg: 'Inserisci un prezzo valido' }));
      return;
    }

    try {
      await apiCall(`/menu/${prodotto.id}`, {
        method: 'PUT',
        body: JSON.stringify({ 
          nome: nome.trim(), 
          prezzo: prezzoNum 
        })
      });
      
      await caricaDati();
      setModifica({ show: false, prodotto: null, nome: '', prezzo: '' });
      mostraMessaggio('✏️ Prodotto modificato con successo!');
    } catch (error) {
      mostraMessaggio('❌ Errore nella modifica del prodotto');
    }
  }, [modifica, apiCall, caricaDati, mostraMessaggio]);

  // ✅ Chiudi modal
  const chiudiModal = useCallback(() => {
    setModifica({ show: false, prodotto: null, nome: '', prezzo: '' });
  }, []);

  // ✅ Gestione input form
  const gestisciInputForm = useCallback((campo, valore) => {
    setForm(prev => ({ ...prev, [campo]: valore }));
  }, []);

  // ✅ Gestione input modifica
  const gestisciInputModifica = useCallback((campo, valore) => {
    setModifica(prev => ({ ...prev, [campo]: valore }));
  }, []);

  // Effetto per caricamento iniziale
  useEffect(() => {
    caricaDati();
  }, [caricaDati]);

  // Effetto per pulire messaggi
  useEffect(() => {
    if (ui.msg) {
      const timer = setTimeout(() => {
        setUi(prev => ({ ...prev, msg: '' }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [ui.msg]);

  const { nome, prezzo, categoria, nuovaCategoria } = form;
  const { attivo, prezzo: prezzoCoperto } = coperto;
  const { msg, loading } = ui;
  
  const categorie = [...new Set(menu.map(item => item.categoria))];

  return (
    <div className="gestione-container">
      <h2>🍽️ Gestione Menù</h2>

      {/* Loading State */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">🔄 Caricamento...</div>
        </div>
      )}

      {/* Aggiungi prodotto */}
      <div className="aggiungi-box">
        <h3>➕ Aggiungi Prodotto</h3>
        <div className="aggiungi-form">
          <input 
            type="text" 
            placeholder="Nome pietanza *" 
            value={nome} 
            onChange={e => gestisciInputForm('nome', e.target.value)}
            disabled={loading}
          />
          <input 
            type="number" 
            placeholder="Prezzo *" 
            step="0.01"
            min="0"
            value={prezzo} 
            onChange={e => gestisciInputForm('prezzo', e.target.value)}
            disabled={loading}
          />
          <select 
            value={categoria} 
            onChange={e => gestisciInputForm('categoria', e.target.value)}
            disabled={loading}
          >
            <option value="">Seleziona categoria *</option>
            {categorie.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
            <option value="nuova">+ Nuova categoria</option>
          </select>
          
          {categoria === 'nuova' && (
            <input 
              type="text" 
              placeholder="Nome nuova categoria *" 
              value={nuovaCategoria} 
              onChange={e => gestisciInputForm('nuovaCategoria', e.target.value)}
              disabled={loading}
            />
          )}
          
          <button 
            onClick={aggiungiProdotto} 
            disabled={loading}
            className={loading ? 'btn-disabled' : ''}
          >
            {loading ? '⏳ Aggiungendo...' : '✅ Aggiungi Prodotto'}
          </button>
        </div>
      </div>

      {/* Gestione coperto */}
      <div className="coperto-box">
        <h3>💰 Gestione Coperto</h3>
        <label>
          <input 
            type="checkbox" 
            checked={attivo} 
            onChange={toggleCoperto}
            disabled={loading}
          />
          Attiva Coperto
        </label>
        {attivo && (
          <input 
            type="number" 
            placeholder="Prezzo coperto" 
            step="0.01"
            min="0"
            value={prezzoCoperto} 
            onChange={e => cambiaPrezzoCoperto(e.target.value)}
            disabled={loading}
          />
        )}
      </div>

      {/* Categorie e prodotti */}
      <div className="categorie-section">
        <h3>📂 Prodotti per Categoria</h3>
        
        {categorie.length === 0 ? (
          <div className="nessun-prodotto">
            <p>📝 Nessun prodotto nel menu. Aggiungi il primo prodotto!</p>
          </div>
        ) : (
          categorie.map(cat => (
            <div key={cat} className="categoria-blocco">
              <div className="categoria-header">
                <h4>📁 {cat}</h4>
                <div className="categoria-actions">
                  <button 
                    className="elimina-cat" 
                    onClick={() => eliminaCategoria(cat)}
                    disabled={loading}
                  >
                    🗑️ Elimina Categoria
                  </button>
                </div>
              </div>
              
              <ul>
                {menu
                  .filter(item => item.categoria === cat)
                  .map(item => (
                    <li key={item.id}>
                      <div className="prodotto-info">
                        <span className="prodotto-nome">{item.nome}</span>
                        <span className="prodotto-prezzo">€ {item.prezzo.toFixed(2)}</span>
                      </div>
                      <div className="prod-actions">
                        <button 
                          className="modifica" 
                          onClick={() => apriModifica(item)}
                          disabled={loading}
                        >
                          ✏️ Modifica
                        </button>
                        <button 
                          className="elimina" 
                          onClick={() => eliminaProdotto(item.id, item.nome)}
                          disabled={loading}
                        >
                          🗑️ Elimina
                        </button>
                      </div>
                    </li>
                  ))
                }
              </ul>
            </div>
          ))
        )}
      </div>

      {/* Modal modifica prodotto */}
      {modifica.show && (
        <div className="modal-backdrop">
          <div className="modal-coperto">
            <h3>✏️ Modifica Prodotto</h3>
            <input 
              type="text" 
              value={modifica.nome} 
              onChange={e => gestisciInputModifica('nome', e.target.value)}
              placeholder="Nome prodotto"
            />
            <input 
              type="number" 
              value={modifica.prezzo} 
              onChange={e => gestisciInputModifica('prezzo', e.target.value)}
              placeholder="Prezzo"
              step="0.01"
              min="0"
            />
            <div className="modal-buttons">
              <button className="ok" onClick={salvaModifica}>
                💾 Salva Modifiche
              </button>
              <button className="annulla" onClick={chiudiModal}>
                ❌ Annulla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messaggio di sistema */}
      {msg && (
        <div className={`msg ${msg.includes('❌') ? 'msg-error' : 'msg-success'}`}>
          {msg}
        </div>
      )}
    </div>
  );
}