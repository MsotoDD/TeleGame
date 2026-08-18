import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

// Componente de Carta MEJORADO - Con fondo blanco sólido
const Carta = ({ valor, palo, esTele = false, estaSeleccionada = false, onPress, tamaño = 'normal' }) => {
  const esRojo = palo === '♥' || palo === '♦';
  const estiloCarta = tamaño === 'pequena' ? styles.cartaPequena : styles.carta;
  const estiloValor = tamaño === 'pequena' ? styles.valorEsquinaPequena : styles.valorEsquina;
  const estiloPaloCentro = tamaño === 'pequena' ? styles.paloCentroPequeno : styles.paloCentro;
  
  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <View style={[
        estiloCarta, 
        estaSeleccionada && styles.cartaSeleccionada
      ]}>
        <View style={styles.esquinaSuperior}>
          <Text style={[estiloValor, esRojo ? styles.rojo : styles.negro]}>
            {valor}
          </Text>
          <Text style={[estiloValor, esRojo ? styles.rojo : styles.negro]}>
            {palo}
          </Text>
        </View>

        <View style={styles.centro}>
          <Text style={[estiloPaloCentro, esRojo ? styles.rojo : styles.negro]}>
            {palo}
          </Text>
        </View>

        <View style={styles.esquinaInferior}>
          <Text style={[estiloValor, esRojo ? styles.rojo : styles.negro]}>
            {valor}
          </Text>
          <Text style={[estiloValor, esRojo ? styles.rojo : styles.negro]}>
            {palo}
          </Text>
        </View>

        {esTele && (
          <View style={styles.teleBadge}>
            <Text style={styles.teleText}>TELE</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Componente de Área de Jugador
const AreaJugador = ({ nombre, esTurnoActivo, esYo = false, posicion }) => {
  return (
    <View style={[
      styles.areaJugador,
      styles[`jugador${posicion}`],
      esTurnoActivo && styles.jugadorActivo
    ]}>
      <View style={[
        styles.nombreJugador,
        esYo && styles.nombreYo
      ]}>
        <Text style={styles.textoNombre}>
          {esYo ? '👤 ' : ''}{nombre}
          {esTurnoActivo && ' 🎯'}
        </Text>
        <Text style={styles.textoPuntos}>Puntos: 0</Text>
      </View>
      
      <View style={styles.manoJugador}>
        <Text style={styles.textoMano}>12 cartas</Text>
      </View>
    </View>
  );
};

// Componente de Mazo CENTRAL MEJORADO
const Mazo = ({ cantidadCartas, onRobar }) => {
  return (
    <TouchableOpacity style={styles.mazo} onPress={onRobar}>
      <View style={styles.cartaMazo}>
        <Text style={styles.textoMazo}>🃏</Text>
      </View>
      <Text style={styles.textoCantidad}>{cantidadCartas}</Text>
      <Text style={styles.textoMazoLabel}>Robar</Text>
    </TouchableOpacity>
  );
};

// Componente de Descarte CENTRAL
const AreaDescarte = ({ ultimaCarta }) => {
  return (
    <View style={styles.descarte}>
      {ultimaCarta ? (
        <Carta 
          valor={ultimaCarta.valor} 
          palo={ultimaCarta.palo} 
          tamaño="normal"
        />
      ) : (
        <View style={styles.descarteVacio}>
          <Text style={styles.textoDescarte}>📤</Text>
          <Text style={styles.textoDescarteLabel}>Vacío</Text>
        </View>
      )}
      <Text style={styles.textoDescarteLabel}>Descarte</Text>
    </View>
  );
};

// Componente de Espejo Revelado (AL LADO DEL MAZO)
const EspejoRevelado = ({ carta }) => {
  const calcularTele = (valorEspejo) => {
    if (!valorEspejo) return '?';
    if (valorEspejo === 'A') return '2';
    if (valorEspejo === 'K') return 'A';
    const valores = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const index = valores.indexOf(valorEspejo);
    return index !== -1 ? valores[index + 1] : '?';
  };

  return (
    <View style={styles.espejoContainer}>
      <Text style={styles.tituloEspejo}>ESPEJO</Text>
      {carta ? (
        <View style={styles.cartaEspejo}>
          <Carta valor={carta.valor} palo={carta.palo} tamaño="normal" />
          <View style={styles.infoTele}>
            <Text style={styles.textoTeleLabel}>TELE:</Text>
            <Text style={styles.textoTeleValor}>
              {calcularTele(carta.valor)} {carta.palo}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.espejoVacio}>
          <Text style={styles.textoEspejo}>?</Text>
          <Text style={styles.textoEspejoLabel}>Por revelar</Text>
        </View>
      )}
    </View>
  );
};

// Pantalla Principal - Mesa de Juego CORREGIDA
export default function HomeScreen() {
  const [estadoJuego, setEstadoJuego] = useState({
    jugadorActivo: 1,
    mazo: 80,
    descarte: [],
    espejo: null,
    jugadores: [
      { id: 1, nombre: 'TÚ', esYo: true, puntos: 0 },
      { id: 2, nombre: 'Ana', puntos: 0 },
      { id: 3, nombre: 'Carlos', puntos: 0 },
      { id: 4, nombre: 'Diana', puntos: 0 }
    ]
  });

  const revelarEspejo = () => {
    setEstadoJuego(prev => ({
      ...prev,
      espejo: { valor: 'A', palo: '♥' }
    }));
  };

  const robarCarta = () => {
    if (estadoJuego.mazo > 0) {
      setEstadoJuego(prev => ({
        ...prev,
        mazo: prev.mazo - 1
      }));
      alert('¡Carta robada del mazo!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🎮 MESA DE JUEGO TELE</Text>
      
      {/* Jugador 2 - ARRIBA */}
      <AreaJugador 
        nombre={estadoJuego.jugadores[1].nombre}
        esTurnoActivo={estadoJuego.jugadorActivo === 2}
        posicion="Arriba"
      />
      
      <View style={styles.areaCentral}>
        {/* Jugador 3 - IZQUIERDA */}
        <AreaJugador 
          nombre={estadoJuego.jugadores[2].nombre}
          esTurnoActivo={estadoJuego.jugadorActivo === 3}
          posicion="Izquierda"
        />
        
        {/* ÁREA CENTRAL - DISTRIBUCIÓN CORREGIDA */}
        <View style={styles.mesaCentral}>
          
          {/* Fila Central: Espejo y Mazo JUNTOS en el centro */}
          <View style={styles.filaCentral}>
            <EspejoRevelado carta={estadoJuego.espejo} />
            
            {/* Controles entre Espejo y Mazo */}
            <View style={styles.areaControles}>
              {!estadoJuego.espejo && (
                <TouchableOpacity style={styles.botonAccion} onPress={revelarEspejo}>
                  <Text style={styles.botonTexto}>🔮 REVELAR ESPEJO</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <Mazo cantidadCartas={estadoJuego.mazo} onRobar={robarCarta} />
          </View>
          
          {/* Fila Inferior: Descarte centrado */}
          <View style={styles.filaInferior}>
            <AreaDescarte ultimaCarta={estadoJuego.descarte[estadoJuego.descarte.length - 1]} />
          </View>
        </View>
        
        {/* Jugador 4 - DERECHA */}
        <AreaJugador 
          nombre={estadoJuego.jugadores[3].nombre}
          esTurnoActivo={estadoJuego.jugadorActivo === 4}
          posicion="Derecha"
        />
      </View>
      
      {/* Jugador 1 - ABAJO (TÚ) */}
      <AreaJugador 
        nombre={estadoJuego.jugadores[0].nombre}
        esTurnoActivo={estadoJuego.jugadorActivo === 1}
        esYo={true}
        posicion="Abajo"
      />

      {/* Información del Turno */}
      <View style={styles.infoTurno}>
        <Text style={styles.textoTurno}>
          🎯 Turno: {estadoJuego.jugadores.find(j => j.id === estadoJuego.jugadorActivo)?.nombre}
        </Text>
      </View>
    </View>
  );
}

// Estilos CORREGIDOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E8B57',
    padding: 10,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  // Estilos para Áreas de Jugadores
  areaJugador: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
    margin: 5,
    minHeight: 80,
  },
  jugadorArriba: {},
  jugadorAbajo: {},
  jugadorIzquierda: {
    width: 100,
    justifyContent: 'center',
  },
  jugadorDerecha: {
    width: 100,
    justifyContent: 'center',
  },
  jugadorActivo: {
    backgroundColor: 'rgba(255,215,0,0.3)',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  nombreJugador: {
    alignItems: 'center',
    marginBottom: 5,
  },
  nombreYo: {
    backgroundColor: 'rgba(30,144,255,0.3)',
    padding: 5,
    borderRadius: 5,
  },
  textoNombre: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  textoPuntos: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },
  manoJugador: {
    alignItems: 'center',
    padding: 5,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 5,
  },
  textoMano: {
    color: 'white',
    fontSize: 10,
    fontStyle: 'italic',
  },
  // Estilos para Área Central CORREGIDA
  areaCentral: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mesaCentral: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 10,
  },
  filaCentral: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    width: '100%',
    marginBottom: 30,
  },
  filaInferior: {
    width: '100%',
    alignItems: 'center',
  },
  // Estilos para Espejo (AL LADO DEL MAZO)
  espejoContainer: {
    alignItems: 'center',
  },
  tituloEspejo: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 8,
  },
  cartaEspejo: {
    alignItems: 'center',
  },
  espejoVacio: {
    width: 80,
    height: 115,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    borderStyle: 'dashed',
  },
  textoEspejo: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  textoEspejoLabel: {
    color: 'white',
    fontSize: 10,
    marginTop: 8,
    textAlign: 'center',
  },
  infoTele: {
    alignItems: 'center',
    marginTop: 10,
    padding: 8,
    backgroundColor: 'rgba(30,144,255,0.4)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E90FF',
  },
  textoTeleLabel: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  textoTeleValor: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Estilos para Controles
  areaControles: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonAccion: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 140,
  },
  botonTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  // Estilos para Mazo CENTRAL MEJORADO
  mazo: {
    alignItems: 'center',
  },
  cartaMazo: {
    width: 80,
    height: 115,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 10,
  },
  textoMazo: {
    fontSize: 32,
    color: 'white',
  },
  textoCantidad: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  textoMazoLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  // Estilos para Descarte
  descarte: {
    alignItems: 'center',
  },
  descarteVacio: {
    width: 80,
    height: 115,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderStyle: 'dashed',
  },
  textoDescarte: {
    fontSize: 28,
    color: 'white',
  },
  textoDescarteLabel: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
  // Estilos de Carta MEJORADOS - FONDO BLANCO SÓLIDO
  carta: {
    width: 80,
    height: 115,
    backgroundColor: 'white', // BLANCO SÓLIDO
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
    position: 'relative',
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cartaPequena: {
    width: 70,
    height: 100,
  },
  cartaSeleccionada: {
    borderWidth: 3,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  esquinaSuperior: {
    position: 'absolute',
    top: 6,
    left: 6,
    alignItems: 'flex-start',
  },
  esquinaInferior: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    alignItems: 'flex-end',
    transform: [{ rotate: '180deg' }],
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  valorEsquina: {
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 14,
  },
  valorEsquinaPequena: {
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 12,
  },
  paloCentro: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  paloCentroPequeno: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rojo: {
    color: '#E00',
  },
  negro: {
    color: '#000',
  },
  teleBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#1E90FF',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'white',
  },
  teleText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: 'white',
  },
  // Información del Turno
  infoTurno: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  textoTurno: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
});