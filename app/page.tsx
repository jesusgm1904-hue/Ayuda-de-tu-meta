"use client";

import { useState } from "react";

type Movimiento = {
  cantidad: number;
  fecha: string;
};

type Meta = {
  id: number;
  nombre: string;
  objetivo: number;
  ahorro: number;
  historial: Movimiento[];
  mostrarInput: boolean;
  mostrarHistorial: boolean;
  completada: boolean;
};

export default function AppPage() {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [nombreMeta, setNombreMeta] = useState("");
  const [cantidadMeta, setCantidadMeta] = useState("");
  const [nuevoValor, setNuevoValor] = useState<{ [key: number]: string }>({});

  const agregarMeta = () => {
    if (!nombreMeta || !cantidadMeta) return;

    const nueva: Meta = {
      id: Date.now(),
      nombre: nombreMeta,
      objetivo: Number(cantidadMeta),
      ahorro: 0,
      historial: [],
      mostrarInput: false,
      mostrarHistorial: false,
      completada: false,
    };

    setMetas([...metas, nueva]);
    setNombreMeta("");
    setCantidadMeta("");
  };

  const toggleInput = (id: number) => {
    setMetas(
      metas.map((m) =>
        m.id === id ? { ...m, mostrarInput: !m.mostrarInput } : m
      )
    );
  };

  const agregarCantidad = (id: number) => {
    const valor = Number(nuevoValor[id]);
    if (!valor) return;

    setMetas(
      metas.map((m) => {
        if (m.id !== id) return m;

        const nuevoAhorro = m.ahorro + valor;
        const completada = nuevoAhorro >= m.objetivo;

        return {
          ...m,
          ahorro: nuevoAhorro,
          completada,
          historial: [
            {
              cantidad: valor,
              fecha: new Date().toLocaleDateString(),
            },
            ...m.historial,
          ],
        };
      })
    );

    setNuevoValor({ ...nuevoValor, [id]: "" });
  };

  const eliminarMeta = (id: number) => {
    setMetas(metas.filter((m) => m.id !== id));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        background:
          "linear-gradient(135deg, black 50%, #f59e0b 50%)",
      }}
    >
      <h1 style={{ color: "white", marginBottom: "20px" }}>
        Mis metas de ahorro
      </h1>

      <div
        style={{
          background: "white",
          padding: "15px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <h3 style={{ color: "black" }}>Nueva meta</h3>

        <input
          placeholder="Nombre de la meta"
          value={nombreMeta}
          onChange={(e) => setNombreMeta(e.target.value)}
          style={{ marginRight: "10px", color: "black" }}
        />

        <input
          placeholder="Cantidad objetivo"
          type="number"
          value={cantidadMeta}
          onChange={(e) => setCantidadMeta(e.target.value)}
          style={{ marginRight: "10px", color: "black" }}
        />

        <button
          onClick={agregarMeta}
          style={{
            background: "#f59e0b",
            border: "none",
            padding: "8px 14px",
            borderRadius: "6px",
            color: "black",
            fontWeight: "bold",
          }}
        >
          Agregar meta
        </button>
      </div>

      {metas.map((meta) => {
        const porcentaje = Math.min(
          Math.round((meta.ahorro / meta.objetivo) * 100),
          100
        );

        return (
          <div
            key={meta.id}
            style={{
              background: "white",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "15px",
            }}
          >
            <h3 style={{ color: "black" }}>{meta.nombre}</h3>

            <p style={{ color: "black" }}>
              ${meta.ahorro} / ${meta.objetivo}
            </p>

            <div
              style={{
                width: "100%",
                height: "20px",
                background: "#e5e7eb",
                borderRadius: "10px",
                overflow: "hidden",
                marginBottom: "5px",
              }}
            >
              <div
                style={{
                  width: `${porcentaje}%`,
                  height: "100%",
                  background: "#10b981",
                  transition: "width 0.6s ease",
                }}
              />
            </div>

            {/* PORCENTAJE CAMBIADO A VERDE OSCURO */}
            <p
              style={{
                fontWeight: "bold",
                color: "#065f46",
              }}
            >
              {porcentaje}%
            </p>

            {!meta.completada && (
              <>
                <button
                  onClick={() => toggleInput(meta.id)}
                  style={{
                    background: "#f59e0b",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    color: "black",
                    marginRight: "10px",
                  }}
                >
                  +
                </button>

                {meta.mostrarInput && (
                  <div style={{ marginTop: "10px" }}>
                    <input
                      type="number"
                      placeholder="Cantidad"
                      value={nuevoValor[meta.id] || ""}
                      onChange={(e) =>
                        setNuevoValor({
                          ...nuevoValor,
                          [meta.id]: e.target.value,
                        })
                      }
                      style={{
                        marginRight: "10px",
                        color: "black",
                      }}
                    />

                    <button
                      onClick={() => agregarCantidad(meta.id)}
                      style={{
                        background: "#f59e0b",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        color: "black",
                      }}
                    >
                      Agregar
                    </button>
                  </div>
                )}
              </>
            )}

            {meta.completada && (
              <div style={{ marginTop: "10px" }}>
                <span style={{ color: "green", fontWeight: "bold" }}>
                  ✔ Meta completada
                </span>

                <button
                  onClick={() => eliminarMeta(meta.id)}
                  style={{
                    marginLeft: "15px",
                    background: "red",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    color: "white",
                  }}
                >
                  Eliminar
                </button>
              </div>
            )}

            {meta.historial.length > 0 && (
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() =>
                    setMetas(
                      metas.map((m) =>
                        m.id === meta.id
                          ? {
                              ...m,
                              mostrarHistorial: !m.mostrarHistorial,
                            }
                          : m
                      )
                    )
                  }
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "black",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  {meta.mostrarHistorial ? "Ver menos" : "Ver más"}
                </button>

                {meta.mostrarHistorial &&
                  meta.historial.map((h, i) => (
                    <div key={i} style={{ color: "black" }}>
                      {h.cantidad > 0 ? "+" : ""}
                      {h.cantidad}
                    </div>
                  ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}