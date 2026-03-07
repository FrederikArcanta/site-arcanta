# Arcanta Setup Flowchart

Configuratiegids voor het opzetten van een tenant in Arcanta.
Twee scenario's: **volledig** (contract + POS) en **basis** (enkel POS).

---

## Scenario A: Contract Catering + POS data

Volledige configuratie voor klanten met een cateringcontract.

```
 STAP 1 ─ Tenant aanmaken (Admin)
 ├── Naam invoeren → tenant ID wordt gegenereerd
 └── Mapstructuur wordt automatisch aangemaakt
      │
      ▼
 STAP 2 ─ Contract data uploaden (Settings > Contract)
 │
 ├── 2a. Food Price List uploaden (CSV/XLSX)
 │        Velden: hoofdgroep, groep, product, stukprijs, BTW%
 │        → Definieert de contractuele productstructuur
 │
 ├── 2b. Personnel configureren
 │        Velden: rol, uurloon, uren per weekdag, maandkost
 │        → Personeelskosten per locatie
 │
 └── 2c. Management configureren
          Velden: item, omschrijving, maandbedrag
          → Vaste beheerskosten
      │
      ▼
 STAP 3 ─ POS data uploaden (Upload POS)
 │
 ├── CSV/XLSX bestand selecteren
 ├── Kolommen mappen (datum, tijd, product, aantal, prijs, ticket)
 ├── POS-modus kiezen (split of compound)
 ├── Test-modus → validatie datums, aantallen, prijzen
 └── Importeren → facts.rds + POS dictionary auto-sync
      │
      ▼
 STAP 4 ─ POS Dictionary instellen (Settings > POS > Dictionary)
 │
 ├── Nieuwe POS-keys controleren (auto-gedetecteerd uit upload)
 ├── Labels toekennen: locatie, outlet, POS-naam
 ├── POS-type instellen (restaurant/coffee/vending/other)
 └── Eventueel POS uitsluiten van analyse
      │
      ▼
 STAP 5 ─ Product Mapping (Settings > Contract > Product Mapping)
 │         *** Vereist: POS data (stap 3) + Food Price List (stap 2a) ***
 │
 ├── POS-producten koppelen aan contractproducten (3 niveaus)
 ├── Auto Match: automatische koppeling op productnaam
 ├── Handmatig: cascading dropdowns (hoofdgroep → groep → product)
 ├── Dekkingspercentage controleren (doel: >90%)
 └── View mode kiezen: "contract" (vereenvoudigd) of "pos" (raw)
      │
      ▼
 STAP 6 ─ Capaciteit & Regels (Settings > POS)
 │
 ├── 6a. Seats configureren
 │        Zitplaatsen per locatie + outlet instellen
 │        → Nodig voor bezettingsgraad berekening
 │
 └── 6b. Utilisation Rules instellen
          Verblijfsduur, dine-in %, non-user %
          → Nodig voor effectieve bezettingsberekening
      │
      ▼
 STAP 7 ─ Bezoekersdata uploaden (Upload Presence) [optioneel]
 │
 ├── CSV/XLSX met dagelijkse aanwezigheid
 ├── Kolommen mappen: datum, locatie, aantal
 └── Importeren → presence.rds
      │
      ▼
 STAP 8 ─ Optionele contractuitbreidingen (Settings > Contract)
 │
 ├── 8a. Indexatie instellen
 │        Periodieke prijsverhogingen (%, ingangsdatum, categorie)
 │
 ├── 8b. Extra Services toevoegen
 │        Eenmalige kosten buiten contract (maand, bedrag, categorie)
 │
 └── 8c. Facturen uploaden/invoeren
          Werkelijke facturen voor vergelijking met berekende kosten
      │
      ▼
 ══════════════════════════════════════════════════
  KLAAR ─ Dashboard, Products, Budget, Data Quality
          zijn nu volledig operationeel
 ══════════════════════════════════════════════════
```

---

## Scenario B: Enkel POS data (geen contract)

Basisconfiguratie voor klanten zonder cateringcontract.

```
 STAP 1 ─ Tenant aanmaken (Admin)
 ├── Naam invoeren → tenant ID wordt gegenereerd
 └── Mapstructuur wordt automatisch aangemaakt
      │
      ▼
 STAP 2 ─ POS data uploaden (Upload POS)
 │
 ├── CSV/XLSX bestand selecteren
 ├── Kolommen mappen (datum, tijd, product, aantal, prijs, ticket)
 ├── POS-modus kiezen (split of compound)
 ├── Test-modus → validatie
 └── Importeren → facts.rds + POS dictionary auto-sync
      │
      ▼
 STAP 3 ─ POS Dictionary instellen (Settings > POS > Dictionary)
 │
 ├── Labels toekennen: locatie, outlet, POS-naam
 ├── POS-type instellen
 └── Eventueel POS uitsluiten
      │
      ▼
 STAP 4 ─ Capaciteit & Regels (Settings > POS)
 │
 ├── 4a. Seats configureren
 │        Zitplaatsen per locatie + outlet
 │
 └── 4b. Utilisation Rules instellen
          Verblijfsduur, dine-in %, non-user %
      │
      ▼
 STAP 5 ─ Bezoekersdata uploaden (Upload Presence) [optioneel]
 │
 └── CSV/XLSX met dagelijkse aanwezigheid
      │
      ▼
 ══════════════════════════════════════════════════
  KLAAR ─ Dashboard, Products, Flow & Utilisation,
          Data Quality zijn operationeel
 ══════════════════════════════════════════════════

  N.B. Zonder contract data zijn deze features
  NIET beschikbaar:
  ✗ Product Mapping (contractview)
  ✗ Budget tab (kostenberekening)
  ✗ Factuurvergelijking
  ✗ Indexatie & Extra Services
```

---

## Vergelijkingstabel

| Stap | Scenario A (Contract+POS) | Scenario B (Enkel POS) |
|------|--------------------------|----------------------|
| 1. Tenant aanmaken | Verplicht | Verplicht |
| 2. Contract data uploaden | Verplicht (food/pers/mgmt) | N.v.t. |
| 3. POS data uploaden | Verplicht | Verplicht |
| 4. POS Dictionary | Verplicht | Verplicht |
| 5. Product Mapping | Verplicht | N.v.t. |
| 6. Seats & Util Rules | Aanbevolen | Aanbevolen |
| 7. Presence data | Optioneel | Optioneel |
| 8. Indexatie | Optioneel | N.v.t. |
| 9. Extra Services | Optioneel | N.v.t. |
| 10. Facturen | Optioneel | N.v.t. |

---

## Afhankelijkheden

```
                    ┌──────────────┐
                    │ TENANT SETUP │
                    └──────┬───────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
     ┌────────────┐  ┌──────────┐  ┌────────────┐
     │ POS Upload │  │ Contract │  │ Presence   │
     │            │  │ Upload   │  │ Upload     │
     └─────┬──────┘  └────┬─────┘  └─────┬──────┘
           │              │              │
     ┌─────┼──────┐       │              │
     │     │      │       │              │
     ▼     ▼      ▼       │              │
  ┌────┐ ┌─────┐ ┌─────┐ │              │
  │Dict│ │Seats│ │Util │ │              │
  │    │ │     │ │Rules│ │              │
  └────┘ └──┬──┘ └─────┘ │              │
            │             │              │
            │    ┌────────┘              │
            │    │                       │
            ▼    ▼                       │
     ┌──────────────┐                   │
     │   Product    │                   │
     │   Mapping    │                   │
     │ (POS+Food)   │                   │
     └──────┬───────┘                   │
            │                           │
            ▼                           │
     ┌──────────────┐                   │
     │  Indexatie   │                   │
     │  Extra Svcs  │                   │
     │  Facturen    │                   │
     └──────┬───────┘                   │
            │                           │
            ▼                           ▼
     ┌──────────────────────────────────────┐
     │           DASHBOARD & ANALYSE        │
     │  Overview │ Products │ Flow │ Budget  │
     └──────────────────────────────────────┘
```

---

## Belangrijke opmerkingen

1. **Volgorde is belangrijk bij Scenario A**: Contract data (stap 2) moet VOOR product mapping (stap 5), want de mapping-dropdowns worden gevuld vanuit de food price list.

2. **POS Dictionary wordt automatisch bijgewerkt** bij elke nieuwe POS upload — nieuwe POS-keys verschijnen automatisch.

3. **Product Mapping** toont een dekkingspercentage. Streef naar >90% voor betrouwbare kostenberekeningen.

4. **Presence data** is onafhankelijk van POS en contract — kan op elk moment worden toegevoegd.

5. **Facturen** zijn bedoeld voor vergelijking met berekende kosten (contract × volumes). Zonder contract data hebben facturen weinig analytische waarde.
