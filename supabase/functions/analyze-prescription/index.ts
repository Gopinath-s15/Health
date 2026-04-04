// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ── Drug Dictionary: ~200 common Indian prescription medicines ──
const DRUG_DATABASE: { name: string; aliases: string[]; category: string; commonDosage: string }[] = [
  // Analgesics & Antipyretics
  { name: "Paracetamol", aliases: ["pcm", "paracetamol", "paracitamol", "parcetamol", "dolo", "crocin", "calpol", "p-500", "tylenol", "acetaminophen", "dolo-650", "dolo650", "paracet"], category: "analgesic", commonDosage: "500mg/650mg" },
  { name: "Ibuprofen", aliases: ["ibuprofen", "brufen", "ibugesic", "combiflam-ibu"], category: "NSAID", commonDosage: "400mg" },
  { name: "Diclofenac", aliases: ["diclofenac", "voveran", "diclo", "dynapar", "voltaren", "diclofenac-sodium"], category: "NSAID", commonDosage: "50mg" },
  { name: "Aceclofenac", aliases: ["aceclofenac", "hifenac", "zerodol", "acemiz"], category: "NSAID", commonDosage: "100mg" },
  { name: "Nimesulide", aliases: ["nimesulide", "nice", "nise", "nimulid"], category: "NSAID", commonDosage: "100mg" },
  { name: "Mefenamic Acid", aliases: ["mefenamic", "meftal", "ponstan", "mefenamic-acid"], category: "NSAID", commonDosage: "250mg/500mg" },
  { name: "Tramadol", aliases: ["tramadol", "ultracet", "contramal"], category: "opioid-analgesic", commonDosage: "50mg" },
  { name: "Aspirin", aliases: ["aspirin", "ecosprin", "disprin", "asp"], category: "NSAID", commonDosage: "75mg/150mg/325mg" },

  // Antibiotics
  { name: "Amoxicillin", aliases: ["amoxicillin", "amox", "amoxyclav", "amoxycillin", "novamox", "mox", "amoxil"], category: "antibiotic", commonDosage: "250mg/500mg" },
  { name: "Amoxicillin + Clavulanate", aliases: ["augmentin", "amoxyclav", "clavam", "amoxicillin-clavulanate", "amox-clav", "moxclav"], category: "antibiotic", commonDosage: "625mg" },
  { name: "Azithromycin", aliases: ["azithromycin", "azithro", "azee", "zithromax", "azicip", "azifast", "azithral", "azith"], category: "antibiotic", commonDosage: "250mg/500mg" },
  { name: "Cefixime", aliases: ["cefixime", "cefixim", "taxim-o", "zifi", "cefix", "omnix", "cefspan"], category: "antibiotic", commonDosage: "200mg" },
  { name: "Cephalexin", aliases: ["cephalexin", "cefalexin", "ceff", "keflex", "alexin", "sporidex"], category: "antibiotic", commonDosage: "250mg/500mg" },
  { name: "Ciprofloxacin", aliases: ["ciprofloxacin", "cipro", "ciplox", "cifran", "ciprobid"], category: "antibiotic", commonDosage: "250mg/500mg" },
  { name: "Levofloxacin", aliases: ["levofloxacin", "levo", "levomac", "levoflox", "tavanic", "glevo", "l-cin"], category: "antibiotic", commonDosage: "250mg/500mg/750mg" },
  { name: "Ofloxacin", aliases: ["ofloxacin", "oflox", "zenflox", "o2", "oflo"], category: "antibiotic", commonDosage: "200mg" },
  { name: "Metronidazole", aliases: ["metronidazole", "metro", "flagyl", "metrogyl", "metron", "metronid"], category: "antibiotic", commonDosage: "200mg/400mg" },
  { name: "Doxycycline", aliases: ["doxycycline", "doxy", "doxt", "doxylab", "doxybond"], category: "antibiotic", commonDosage: "100mg" },
  { name: "Norfloxacin", aliases: ["norfloxacin", "norflox", "uroflox"], category: "antibiotic", commonDosage: "400mg" },
  { name: "Cefpodoxime", aliases: ["cefpodoxime", "cefpod", "cepodem", "vantin"], category: "antibiotic", commonDosage: "100mg/200mg" },
  { name: "Ceftriaxone", aliases: ["ceftriaxone", "monocef", "rocephin", "ceftri"], category: "antibiotic", commonDosage: "1g" },
  { name: "Clindamycin", aliases: ["clindamycin", "dalacin", "clinda"], category: "antibiotic", commonDosage: "150mg/300mg" },
  { name: "Linezolid", aliases: ["linezolid", "lizolid", "linospan"], category: "antibiotic", commonDosage: "600mg" },
  { name: "Nitrofurantoin", aliases: ["nitrofurantoin", "furadantin", "niftran"], category: "antibiotic", commonDosage: "100mg" },
  { name: "Cotrimoxazole", aliases: ["cotrimoxazole", "bactrim", "septran", "tmp-smx", "trimethoprim"], category: "antibiotic", commonDosage: "DS" },

  // Gastrointestinal
  { name: "Pantoprazole", aliases: ["pantoprazole", "panto", "pan", "pan-40", "pantop", "pantocid", "p-40", "pantium"], category: "PPI", commonDosage: "40mg" },
  { name: "Omeprazole", aliases: ["omeprazole", "omez", "omee", "prilosec"], category: "PPI", commonDosage: "20mg" },
  { name: "Rabeprazole", aliases: ["rabeprazole", "razo", "rabeloc", "rablet", "rabicip"], category: "PPI", commonDosage: "20mg" },
  { name: "Esomeprazole", aliases: ["esomeprazole", "nexium", "neksium", "sompraz", "raciper"], category: "PPI", commonDosage: "20mg/40mg" },
  { name: "Domperidone", aliases: ["domperidone", "dom", "domstal", "vomistop", "domperi"], category: "antiemetic", commonDosage: "10mg" },
  { name: "Ondansetron", aliases: ["ondansetron", "ondem", "emeset", "zofran", "vomikind"], category: "antiemetic", commonDosage: "4mg/8mg" },
  { name: "Ranitidine", aliases: ["ranitidine", "rantac", "zinetac", "aciloc", "zantac"], category: "H2-blocker", commonDosage: "150mg" },
  { name: "Sucralfate", aliases: ["sucralfate", "sucralcote", "sucrafil"], category: "GI-protectant", commonDosage: "1g" },
  { name: "Racecadotril", aliases: ["racecadotril", "redotil", "hidrasec", "enuff"], category: "anti-diarrheal", commonDosage: "100mg" },
  { name: "Loperamide", aliases: ["loperamide", "imodium", "lopamide"], category: "anti-diarrheal", commonDosage: "2mg" },
  { name: "Bismuth Subsalicylate", aliases: ["bismuth", "pepto-bismol", "pepto"], category: "GI-protectant", commonDosage: "262mg" },
  { name: "Rabeprazole + Domperidone", aliases: ["razo-d", "razo-dsr", "rablet-d", "rabicip-d", "rabeprazole-domperidone", "r-d"], category: "PPI+antiemetic", commonDosage: "20mg+10mg" },
  { name: "Pantoprazole + Domperidone", aliases: ["pan-d", "pantop-d", "pantocid-d", "p-d", "pantoprazole-domperidone"], category: "PPI+antiemetic", commonDosage: "40mg+10mg" },
  { name: "Omeprazole + Domperidone", aliases: ["omez-d", "omee-d", "omeprazole-domperidone"], category: "PPI+antiemetic", commonDosage: "20mg+10mg" },
  { name: "Drotaverine", aliases: ["drotaverine", "drotin", "no-spa", "drotin-ds"], category: "antispasmodic", commonDosage: "40mg/80mg" },
  { name: "Dicyclomine", aliases: ["dicyclomine", "cyclopam", "meftal-spas", "colimex"], category: "antispasmodic", commonDosage: "10mg/20mg" },
  { name: "Isabgol (Psyllium Husk)", aliases: ["isabgol", "psyllium", "sat-isabgol", "fybogel", "metamucil"], category: "laxative", commonDosage: "5g" },
  { name: "Lactulose", aliases: ["lactulose", "duphalac", "laxose"], category: "laxative", commonDosage: "15ml" },
  { name: "Bisacodyl", aliases: ["bisacodyl", "dulcolax", "laxowind"], category: "laxative", commonDosage: "5mg" },
  { name: "ORS (Oral Rehydration Salt)", aliases: ["ors", "electral", "enerzal", "oral-rehydration"], category: "rehydration", commonDosage: "1 sachet" },

  // Antihistamines & Anti-allergics
  { name: "Cetirizine", aliases: ["cetirizine", "cetzine", "cetriz", "zyrtec", "okacet", "allercet"], category: "antihistamine", commonDosage: "10mg" },
  { name: "Levocetirizine", aliases: ["levocetirizine", "levocet", "xyzal", "vozet", "lcz"], category: "antihistamine", commonDosage: "5mg" },
  { name: "Fexofenadine", aliases: ["fexofenadine", "allegra", "fexo", "altiva"], category: "antihistamine", commonDosage: "120mg/180mg" },
  { name: "Chlorpheniramine", aliases: ["chlorpheniramine", "cpm", "piriton", "avil-cpm", "cpam"], category: "antihistamine", commonDosage: "4mg" },
  { name: "Loratadine", aliases: ["loratadine", "claritin", "lorfast"], category: "antihistamine", commonDosage: "10mg" },
  { name: "Montelukast", aliases: ["montelukast", "montair", "singulair", "montek", "romilast", "monte", "montelu"], category: "anti-allergic", commonDosage: "10mg" },
  { name: "Montelukast + Levocetirizine", aliases: ["montair-lc", "montek-lc", "montelukast-lc", "monte-lc", "montel-lc"], category: "anti-allergic", commonDosage: "10mg+5mg" },

  // Respiratory
  { name: "Salbutamol", aliases: ["salbutamol", "asthalin", "ventolin", "albuterol", "salbair"], category: "bronchodilator", commonDosage: "2mg/4mg/100mcg inhaler" },
  { name: "Levosalbutamol", aliases: ["levosalbutamol", "levolin", "xopenex"], category: "bronchodilator", commonDosage: "1mg nebuliser" },
  { name: "Budesonide", aliases: ["budesonide", "budecort", "pulmicort", "foracort-bud"], category: "corticosteroid-inhaler", commonDosage: "200mcg/400mcg" },
  { name: "Fluticasone", aliases: ["fluticasone", "flohale", "flutivate", "flixotide"], category: "corticosteroid-inhaler", commonDosage: "125mcg/250mcg" },
  { name: "Formoterol + Budesonide", aliases: ["foracort", "symbicort", "formoterol-budesonide"], category: "inhaler-combo", commonDosage: "6/200mcg" },
  { name: "Ipratropium Bromide", aliases: ["ipratropium", "ipravent", "atrovent", "duolin-ipra"], category: "bronchodilator", commonDosage: "20mcg" },
  { name: "Dextromethorphan", aliases: ["dextromethorphan", "dxm", "benylin", "coscopin"], category: "cough-suppressant", commonDosage: "10mg" },
  { name: "Guaifenesin", aliases: ["guaifenesin", "mucinex", "tusq"], category: "expectorant", commonDosage: "100mg" },
  { name: "Ambroxol", aliases: ["ambroxol", "ambrodil", "mucolite", "mucosolvan"], category: "mucolytic", commonDosage: "30mg" },
  { name: "Bromhexine", aliases: ["bromhexine", "ascoril-brom", "solvin"], category: "mucolytic", commonDosage: "8mg" },
  { name: "Theophylline", aliases: ["theophylline", "theolong", "deriphyllin", "theo"], category: "bronchodilator", commonDosage: "200mg/300mg" },

  // Corticosteroids
  { name: "Prednisolone", aliases: ["prednisolone", "pred", "wysolone", "omnacortil"], category: "corticosteroid", commonDosage: "5mg/10mg/20mg" },
  { name: "Methylprednisolone", aliases: ["methylprednisolone", "medrol", "mepresso", "solu-medrol", "methyl-pred", "melt", "mp"], category: "corticosteroid", commonDosage: "4mg/8mg/16mg" },
  { name: "Dexamethasone", aliases: ["dexamethasone", "dexona", "decadron", "dexa"], category: "corticosteroid", commonDosage: "0.5mg/4mg" },
  { name: "Deflazacort", aliases: ["deflazacort", "defcort", "monocort", "calcort"], category: "corticosteroid", commonDosage: "6mg/12mg" },
  { name: "Hydrocortisone", aliases: ["hydrocortisone", "cortisone", "hycort"], category: "corticosteroid", commonDosage: "10mg/20mg" },

  // Cardiovascular
  { name: "Amlodipine", aliases: ["amlodipine", "amlo", "amlopin", "norvasc", "amlong"], category: "antihypertensive", commonDosage: "5mg/10mg" },
  { name: "Atenolol", aliases: ["atenolol", "aten", "tenormin"], category: "beta-blocker", commonDosage: "25mg/50mg" },
  { name: "Metoprolol", aliases: ["metoprolol", "betaloc", "metolar", "lopressor"], category: "beta-blocker", commonDosage: "25mg/50mg" },
  { name: "Losartan", aliases: ["losartan", "losacar", "cozaar", "losar"], category: "ARB", commonDosage: "25mg/50mg" },
  { name: "Telmisartan", aliases: ["telmisartan", "telma", "telmikind", "micardis", "telmi"], category: "ARB", commonDosage: "20mg/40mg/80mg" },
  { name: "Ramipril", aliases: ["ramipril", "cardace", "ramistar"], category: "ACE-inhibitor", commonDosage: "2.5mg/5mg" },
  { name: "Enalapril", aliases: ["enalapril", "envas", "vasotec"], category: "ACE-inhibitor", commonDosage: "2.5mg/5mg" },
  { name: "Hydrochlorothiazide", aliases: ["hydrochlorothiazide", "hctz", "aquazide", "hydrazide"], category: "diuretic", commonDosage: "12.5mg/25mg" },
  { name: "Furosemide", aliases: ["furosemide", "lasix", "frusamide", "frusemide"], category: "diuretic", commonDosage: "20mg/40mg" },
  { name: "Spironolactone", aliases: ["spironolactone", "aldactone", "spiromide"], category: "diuretic", commonDosage: "25mg/50mg" },
  { name: "Clopidogrel", aliases: ["clopidogrel", "clopilet", "plavix", "clopitab"], category: "antiplatelet", commonDosage: "75mg" },
  { name: "Atorvastatin", aliases: ["atorvastatin", "atorva", "lipitor", "atocor", "storvas"], category: "statin", commonDosage: "10mg/20mg/40mg" },
  { name: "Rosuvastatin", aliases: ["rosuvastatin", "rosuvas", "crestor", "rozavel"], category: "statin", commonDosage: "5mg/10mg/20mg" },
  { name: "Digoxin", aliases: ["digoxin", "lanoxin"], category: "cardiac-glycoside", commonDosage: "0.25mg" },
  { name: "Nitroglycerin", aliases: ["nitroglycerin", "sorbitrate", "nitrostat", "ntg"], category: "vasodilator", commonDosage: "2.5mg/6.4mg" },
  { name: "Diltiazem", aliases: ["diltiazem", "dilzem", "cardizem"], category: "CCB", commonDosage: "30mg/60mg" },
  { name: "Verapamil", aliases: ["verapamil", "isoptin", "calaptin"], category: "CCB", commonDosage: "40mg/80mg" },
  { name: "Warfarin", aliases: ["warfarin", "warf", "coumadin"], category: "anticoagulant", commonDosage: "1mg/2mg/5mg" },

  // Diabetes
  { name: "Metformin", aliases: ["metformin", "glycomet", "glucophage", "glyciphage", "met"], category: "antidiabetic", commonDosage: "500mg/850mg/1000mg" },
  { name: "Glimepiride", aliases: ["glimepiride", "glimep", "amaryl", "glimisave"], category: "antidiabetic", commonDosage: "1mg/2mg" },
  { name: "Glibenclamide", aliases: ["glibenclamide", "glyburide", "daonil", "glibenese"], category: "antidiabetic", commonDosage: "2.5mg/5mg" },
  { name: "Sitagliptin", aliases: ["sitagliptin", "januvia", "istavel"], category: "DPP4-inhibitor", commonDosage: "50mg/100mg" },
  { name: "Vildagliptin", aliases: ["vildagliptin", "galvus", "jalra"], category: "DPP4-inhibitor", commonDosage: "50mg" },
  { name: "Pioglitazone", aliases: ["pioglitazone", "pioz", "actos"], category: "antidiabetic", commonDosage: "15mg/30mg" },
  { name: "Insulin Glargine", aliases: ["insulin-glargine", "lantus", "basalog", "glaritus"], category: "insulin", commonDosage: "varies" },

  // Vitamins & Supplements
  { name: "Calcium + Vitamin D3", aliases: ["calcium", "calcirol", "shelcal", "ccm", "calcium-d3", "cal-d3", "gemcal"], category: "supplement", commonDosage: "500mg+250IU" },
  { name: "Vitamin B Complex", aliases: ["b-complex", "becosules", "neurobion", "polybion", "b-comp", "vit-b"], category: "supplement", commonDosage: "" },
  { name: "Iron + Folic Acid", aliases: ["iron", "ferrous-sulfate", "fefol", "dexorange", "autrin", "livogen", "iron-folic"], category: "supplement", commonDosage: "varies" },
  { name: "Multivitamin", aliases: ["multivitamin", "multi-vit", "supradyn", "zincovit", "revital", "a-to-z"], category: "supplement", commonDosage: "" },
  { name: "Vitamin C", aliases: ["vitamin-c", "ascorbic-acid", "limcee", "celin"], category: "supplement", commonDosage: "500mg" },
  { name: "Vitamin D3", aliases: ["vitamin-d3", "cholecalciferol", "d3", "arachitol", "uprise-d3", "d-rise"], category: "supplement", commonDosage: "1000IU/60000IU" },
  { name: "Vitamin E", aliases: ["vitamin-e", "evion", "tocopherol"], category: "supplement", commonDosage: "200mg/400mg" },
  { name: "Zinc", aliases: ["zinc", "zincovit-zinc", "zincofer", "zinconia"], category: "supplement", commonDosage: "20mg/50mg" },
  { name: "Folic Acid", aliases: ["folic-acid", "folvite", "folate"], category: "supplement", commonDosage: "5mg" },
  { name: "Omega-3 Fatty Acids", aliases: ["omega-3", "fish-oil", "maxepa", "omegafort"], category: "supplement", commonDosage: "1000mg" },

  // Anti-fungal
  { name: "Fluconazole", aliases: ["fluconazole", "forcan", "zocon", "diflucan", "fluco"], category: "antifungal", commonDosage: "150mg" },
  { name: "Clotrimazole", aliases: ["clotrimazole", "candid", "canesten"], category: "antifungal", commonDosage: "1% cream" },
  { name: "Itraconazole", aliases: ["itraconazole", "canditral", "sporanox", "itaspor"], category: "antifungal", commonDosage: "100mg/200mg" },
  { name: "Terbinafine", aliases: ["terbinafine", "lamisil", "tyza"], category: "antifungal", commonDosage: "250mg" },
  { name: "Ketoconazole", aliases: ["ketoconazole", "nizoral", "kz"], category: "antifungal", commonDosage: "200mg" },

  // Anti-viral
  { name: "Acyclovir", aliases: ["acyclovir", "zovirax", "acivir"], category: "antiviral", commonDosage: "200mg/400mg/800mg" },
  { name: "Oseltamivir", aliases: ["oseltamivir", "tamiflu", "fluvir"], category: "antiviral", commonDosage: "75mg" },

  // Psychiatric & Neuro
  { name: "Alprazolam", aliases: ["alprazolam", "alprax", "restyl", "trika", "xanax"], category: "anxiolytic", commonDosage: "0.25mg/0.5mg" },
  { name: "Clonazepam", aliases: ["clonazepam", "clonotril", "rivotril", "clonafit"], category: "anticonvulsant", commonDosage: "0.25mg/0.5mg" },
  { name: "Diazepam", aliases: ["diazepam", "valium", "calmpose"], category: "anxiolytic", commonDosage: "5mg/10mg" },
  { name: "Amitriptyline", aliases: ["amitriptyline", "tryptomer", "elavil"], category: "antidepressant", commonDosage: "10mg/25mg" },
  { name: "Sertraline", aliases: ["sertraline", "serta", "zoloft", "daxid"], category: "antidepressant", commonDosage: "25mg/50mg" },
  { name: "Escitalopram", aliases: ["escitalopram", "nexito", "cipralex", "stalopam"], category: "antidepressant", commonDosage: "5mg/10mg" },
  { name: "Fluoxetine", aliases: ["fluoxetine", "fludac", "prozac", "fluxater"], category: "antidepressant", commonDosage: "20mg" },
  { name: "Gabapentin", aliases: ["gabapentin", "gabapin", "neurontin", "gabin"], category: "anticonvulsant", commonDosage: "100mg/300mg" },
  { name: "Pregabalin", aliases: ["pregabalin", "pregaba", "lyrica", "pregalin"], category: "anticonvulsant", commonDosage: "75mg/150mg" },
  { name: "Phenytoin", aliases: ["phenytoin", "eptoin", "dilantin"], category: "anticonvulsant", commonDosage: "100mg" },
  { name: "Carbamazepine", aliases: ["carbamazepine", "tegrital", "tegretol", "zen"], category: "anticonvulsant", commonDosage: "100mg/200mg" },
  { name: "Valproic Acid", aliases: ["valproic-acid", "valproate", "encorate", "depakote", "valparin"], category: "anticonvulsant", commonDosage: "200mg/500mg" },
  { name: "Levetiracetam", aliases: ["levetiracetam", "levera", "keppra", "levipil"], category: "anticonvulsant", commonDosage: "250mg/500mg" },
  { name: "Olanzapine", aliases: ["olanzapine", "oleanz", "zyprexa"], category: "antipsychotic", commonDosage: "2.5mg/5mg/10mg" },
  { name: "Risperidone", aliases: ["risperidone", "risdone", "risperdal", "sizodon"], category: "antipsychotic", commonDosage: "1mg/2mg" },
  { name: "Quetiapine", aliases: ["quetiapine", "qutan", "seroquel"], category: "antipsychotic", commonDosage: "25mg/100mg" },

  // Muscle Relaxants
  { name: "Tizanidine", aliases: ["tizanidine", "tizan", "sirdalud"], category: "muscle-relaxant", commonDosage: "2mg/4mg" },
  { name: "Thiocolchicoside", aliases: ["thiocolchicoside", "myoril", "thiocoside", "thio"], category: "muscle-relaxant", commonDosage: "4mg/8mg" },
  { name: "Chlorzoxazone", aliases: ["chlorzoxazone", "flexon", "myoflex"], category: "muscle-relaxant", commonDosage: "250mg/500mg" },
  { name: "Eperisone", aliases: ["eperisone", "epigat", "myonal"], category: "muscle-relaxant", commonDosage: "50mg" },

  // Thyroid
  { name: "Levothyroxine", aliases: ["levothyroxine", "thyronorm", "eltroxin", "thyrox", "levo-t4"], category: "thyroid", commonDosage: "25mcg/50mcg/75mcg/100mcg" },

  // Dermatological
  { name: "Hydroxyzine", aliases: ["hydroxyzine", "atarax", "ucerax"], category: "antihistamine", commonDosage: "10mg/25mg" },
  { name: "Mupirocin", aliases: ["mupirocin", "t-bact", "bactroban"], category: "topical-antibiotic", commonDosage: "2% ointment" },
  { name: "Fusidic Acid", aliases: ["fusidic-acid", "fucidin", "fusiwal"], category: "topical-antibiotic", commonDosage: "2% cream" },
  { name: "Betamethasone", aliases: ["betamethasone", "betnovate", "diprovate"], category: "topical-steroid", commonDosage: "0.05%/0.1% cream" },
  { name: "Clobetasol", aliases: ["clobetasol", "tenovate", "clobevate", "dermovate"], category: "topical-steroid", commonDosage: "0.05% cream" },
  { name: "Permethrin", aliases: ["permethrin", "permitin", "perlice"], category: "antiparasitic", commonDosage: "5% cream" },

  // Ophthalmology
  { name: "Tobramycin Eye Drops", aliases: ["tobramycin", "tobrex", "tobra"], category: "ophthalmic", commonDosage: "0.3%" },
  { name: "Moxifloxacin Eye Drops", aliases: ["moxifloxacin-eye", "vigamox", "milflox-eye", "moxicip-eye"], category: "ophthalmic", commonDosage: "0.5%" },
  { name: "Carboxymethylcellulose Eye Drops", aliases: ["cmc", "refresh-tears", "tear-drops", "lubricant-eye"], category: "ophthalmic", commonDosage: "0.5%" },

  // ENT
  { name: "Oxymetazoline Nasal Spray", aliases: ["oxymetazoline", "nasivion", "otrivin-oxy"], category: "nasal-decongestant", commonDosage: "0.05%" },
  { name: "Xylometazoline Nasal Spray", aliases: ["xylometazoline", "otrivin", "nasivion-xylo", "xylo"], category: "nasal-decongestant", commonDosage: "0.1%" },
  { name: "Fluticasone Nasal Spray", aliases: ["fluticasone-nasal", "flonase", "flomist", "avamys"], category: "nasal-steroid", commonDosage: "50mcg" },

  // Anti-emetics
  { name: "Metoclopramide", aliases: ["metoclopramide", "perinorm", "reglan", "emidol"], category: "antiemetic", commonDosage: "10mg" },
  { name: "Prochlorperazine", aliases: ["prochlorperazine", "stemetil", "compazine"], category: "antiemetic", commonDosage: "5mg" },

  // Miscellaneous
  { name: "Sildenafil", aliases: ["sildenafil", "viagra", "manforce", "penegra"], category: "PDE5-inhibitor", commonDosage: "25mg/50mg/100mg" },
  { name: "Tamsulosin", aliases: ["tamsulosin", "urimax", "flomax", "contiflo"], category: "alpha-blocker", commonDosage: "0.4mg" },
  { name: "Finasteride", aliases: ["finasteride", "finpecia", "propecia", "finax"], category: "5-alpha-reductase", commonDosage: "1mg/5mg" },
  { name: "Allopurinol", aliases: ["allopurinol", "zyloric", "zyloprim"], category: "anti-gout", commonDosage: "100mg/300mg" },
  { name: "Colchicine", aliases: ["colchicine", "zycolchin", "colchimax"], category: "anti-gout", commonDosage: "0.5mg" },
  { name: "Methotrexate", aliases: ["methotrexate", "folitrax", "trexall", "mtx"], category: "DMARD", commonDosage: "7.5mg/10mg/15mg" },
  { name: "Hydroxychloroquine", aliases: ["hydroxychloroquine", "hcq", "hcqs", "plaquenil"], category: "DMARD", commonDosage: "200mg/400mg" },
];

// ── Non-medicine words to filter out (headers, instructions, noise) ──
const NON_MEDICINE_WORDS = new Set([
  "tablet", "capsule", "syrup", "injection", "cream", "ointment", "drops",
  "diagnosis", "complaint", "history", "follow", "advice", "rest", "water",
  "exercise", "diet", "review", "next", "visit", "days", "weeks", "months",
  "patient", "name", "age", "sex", "male", "female", "date", "rx", "sig",
  "take", "apply", "use", "give", "stat", "sos", "prn", "od", "bd", "tds",
  "qid", "hs", "ac", "pc", "morning", "night", "evening", "afternoon",
  "before", "after", "food", "meals", "empty", "stomach", "oral", "topical",
  "external", "internal", "tab", "cap", "inj", "syr", "susp", "dr", "prof",
]);

// ── Normalize text for matching ──
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

// ── Levenshtein distance for fuzzy matching ──
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const d: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
    }
  }
  return d[m][n];
}

// ── Match a medicine name against the drug dictionary ──
function matchDrug(rawName: string): { matched: boolean; name: string; category: string; confidence: number; matchType: string } {
  const norm = normalize(rawName);
  if (!norm || norm.length < 3) return { matched: false, name: rawName, category: "unknown", confidence: 0, matchType: "none" };

  // Filter out obvious non-medicine words
  const words = rawName.toLowerCase().split(/\s+/);
  const allNonMed = words.every(w => NON_MEDICINE_WORDS.has(w.replace(/[^a-z]/g, "")));
  if (allNonMed && words.length <= 2) {
    return { matched: false, name: rawName, category: "noise", confidence: 0, matchType: "filtered" };
  }

  // 1. Exact alias match → confidence 1.0
  for (const drug of DRUG_DATABASE) {
    for (const alias of drug.aliases) {
      if (normalize(alias) === norm) {
        return { matched: true, name: drug.name, category: drug.category, confidence: 1.0, matchType: "exact" };
      }
    }
  }

  // 2. Substring/contains match → confidence 0.85
  for (const drug of DRUG_DATABASE) {
    for (const alias of drug.aliases) {
      const normAlias = normalize(alias);
      if (norm.includes(normAlias) || normAlias.includes(norm)) {
        if (Math.min(norm.length, normAlias.length) >= 3) {
          return { matched: true, name: drug.name, category: drug.category, confidence: 0.85, matchType: "substring" };
        }
      }
    }
  }

  // 3. Fuzzy match (Levenshtein) → confidence based on distance
  let bestMatch: typeof DRUG_DATABASE[0] | null = null;
  let bestDist = Infinity;

  for (const drug of DRUG_DATABASE) {
    for (const alias of drug.aliases) {
      const normAlias = normalize(alias);
      const dist = levenshtein(norm, normAlias);
      const maxLen = Math.max(normAlias.length, norm.length);
      const threshold = maxLen > 8 ? 3 : maxLen > 5 ? 2 : 1;
      if (dist <= threshold && dist < bestDist) {
        bestDist = dist;
        bestMatch = drug;
      }
    }
  }

  if (bestMatch) {
    const maxLen = Math.max(norm.length, 1);
    const confidence = Math.max(0.5, 1 - (bestDist / maxLen));
    return { matched: true, name: bestMatch.name, category: bestMatch.category, confidence, matchType: "fuzzy" };
  }

  return { matched: false, name: rawName, category: "unknown", confidence: 0, matchType: "none" };
}

// ── Normalize dosage patterns (Indian prescription style) ──
function normalizeDosagePattern(dosage: string): { normalized: string; frequency: string | null } {
  const d = dosage.trim();

  // Match X-Y-Z pattern (e.g., 1-0-1, 1-1-1, 0-0-1)
  const xyzMatch = d.match(/(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)/);
  if (xyzMatch) {
    const [, m, a, n] = xyzMatch;
    const slots: string[] = [];
    if (parseFloat(m) > 0) slots.push("Morning");
    if (parseFloat(a) > 0) slots.push("Afternoon");
    if (parseFloat(n) > 0) slots.push("Night");
    return { normalized: d, frequency: slots.length > 0 ? slots.join(" & ") : null };
  }

  return { normalized: d, frequency: null };
}

// ── Normalize timing strings ──
function normalizeTiming(timing: string, dosage?: string): string {
  // First check if dosage has X-Y-Z pattern
  if (dosage) {
    const { frequency } = normalizeDosagePattern(dosage);
    if (frequency) return frequency;
  }

  const t = timing.toLowerCase();
  const slots: string[] = [];

  // Check common abbreviations first
  if (/\bsos\b/i.test(t)) return "As needed (SOS)";
  if (/\bstat\b/i.test(t)) return "Immediately (STAT)";
  if (/\bprn\b/i.test(t)) return "As needed";

  if (t.includes("morn") || /\bam\b/.test(t) || t.includes("breakfast")) slots.push("Morning");
  if (t.includes("after") && t.includes("noon") || t.includes("lunch")) slots.push("Afternoon");
  if (t.includes("night") || t.includes("evening") || t.includes("bed") || t.includes("dinner") || /\bpm\b/.test(t)) slots.push("Night");

  if (t.includes("once") && t.includes("daily") && slots.length === 0) slots.push("Once daily");
  if (/\bod\b/.test(t) && slots.length === 0) slots.push("Once daily");
  if (/\bbd\b/.test(t) || /\bbid\b/.test(t) || t.includes("twice")) {
    if (slots.length === 0) { slots.push("Morning"); slots.push("Night"); }
  }
  if (/\btds\b/.test(t) || /\btid\b/.test(t) || t.includes("thrice")) {
    if (slots.length === 0) { slots.push("Morning"); slots.push("Afternoon"); slots.push("Night"); }
  }
  if (/\bqid\b/.test(t)) {
    return "4 times daily";
  }
  if (/\bhs\b/.test(t) || t.includes("bedtime")) {
    if (slots.length === 0) slots.push("At bedtime");
  }
  if (/\bweekly\b/.test(t)) return "Once weekly";

  if (slots.length === 0) return timing; // keep original if unrecognized
  return slots.join(" & ");
}

// ── Normalize food instructions ──
function normalizeFood(food: string): string {
  const f = food.toLowerCase();
  if (/\bac\b/.test(f) || f.includes("before")) return "Before food";
  if (/\bpc\b/.test(f) || f.includes("after")) return "After food";
  if (f.includes("with")) return "With food";
  if (f.includes("empty")) return "On empty stomach";
  return food || "N/A";
}

// ── Extract duration from text ──
function extractDuration(text: string): string | null {
  // Match "5 days", "for 7 days", "x 10 days", "2 weeks", "1 month"
  const durationMatch = text.match(/(?:for\s+|x\s+)?(\d+)\s*(days?|weeks?|months?)/i);
  if (durationMatch) return `${durationMatch[1]} ${durationMatch[2].toLowerCase()}`;

  // Match circled numbers (AI might describe them as e.g., "(5)" or "⑤")
  const circledMatch = text.match(/[⓪①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮]/);
  if (circledMatch) {
    const circledMap: Record<string, number> = { "⓪": 0, "①": 1, "②": 2, "③": 3, "④": 4, "⑤": 5, "⑥": 6, "⑦": 7, "⑧": 8, "⑨": 9, "⑩": 10, "⑪": 11, "⑫": 12, "⑬": 13, "⑭": 14, "⑮": 15 };
    const num = circledMap[circledMatch[0]];
    if (num) return `${num} days`;
  }

  // Match parenthesized numbers often used for duration
  const parenMatch = text.match(/\((\d+)\)\s*(?:days?)?/i);
  if (parenMatch) return `${parenMatch[1]} days`;

  return null;
}

// ── Medical context validation ──
// Flag potentially dangerous combinations
const INTERACTION_WARNINGS: [string, string, string][] = [
  ["NSAID", "anticoagulant", "⚠️ NSAID + Anticoagulant: bleeding risk"],
  ["NSAID", "NSAID", "⚠️ Multiple NSAIDs: increased GI/renal risk"],
  ["ACE-inhibitor", "ARB", "⚠️ ACE + ARB: hyperkalemia risk"],
  ["statin", "statin", "⚠️ Multiple statins: muscle toxicity risk"],
];

function checkInteractions(medicines: { category: string; name: string }[]): string[] {
  const warnings: string[] = [];
  for (let i = 0; i < medicines.length; i++) {
    for (let j = i + 1; j < medicines.length; j++) {
      for (const [cat1, cat2, warning] of INTERACTION_WARNINGS) {
        if (
          (medicines[i].category === cat1 && medicines[j].category === cat2) ||
          (medicines[i].category === cat2 && medicines[j].category === cat1)
        ) {
          warnings.push(`${warning} (${medicines[i].name} + ${medicines[j].name})`);
        }
      }
    }
  }
  return warnings;
}

// ── Post-process extracted data ──
function postProcess(extracted: {
  date: string;
  hospitalName: string;
  doctorName: string;
  summary?: string;
  medicines: { name: string; dosage: string; timing: string; food: string }[];
}) {
  const validatedMedicines = extracted.medicines.map((med) => {
    const match = matchDrug(med.name);

    // Skip noise entries
    if (match.matchType === "filtered") return null;

    // Extract strength from original name if present
    const strengthMatch = med.name.match(/(\d+(?:\.\d+)?\s*(?:mg|mcg|ml|g|iu|units?)(?:\s*\/\s*\d+(?:\.\d+)?\s*(?:mg|mcg|ml|g|iu|units?))?)/i);
    const strength = strengthMatch ? ` ${strengthMatch[1].trim()}` : "";

    // Extract form from original name
    const formMatch = med.name.match(/(tablet|capsule|syrup|injection|cream|ointment|drops|inhaler|suspension|gel|lotion|spray|sachet|powder)/i);
    const form = formMatch ? ` ${formMatch[1].charAt(0).toUpperCase() + formMatch[1].slice(1).toLowerCase()}` : "";

    const correctedName = match.matched
      ? `${match.name}${strength}${form}`
      : med.name;

    const duration = extractDuration(med.dosage) || extractDuration(med.timing) || extractDuration(med.name);

    return {
      name: correctedName,
      dosage: med.dosage,
      timing: normalizeTiming(med.timing, med.dosage),
      food: normalizeFood(med.food),
      ...(duration ? { duration } : {}),
      _validation: {
        originalName: med.name,
        matched: match.matched,
        confidence: match.confidence,
        matchType: match.matchType,
        category: match.category,
      },
    };
  }).filter(Boolean) as Array<{
    name: string; dosage: string; timing: string; food: string; duration?: string;
    _validation: { originalName: string; matched: boolean; confidence: number; matchType: string; category: string };
  }>;

  // Remove duplicates (same corrected name)
  const seen = new Set<string>();
  const deduplicated = validatedMedicines.filter((med) => {
    const key = normalize(med.name);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Check drug interactions
  const matchedMeds = deduplicated
    .filter(m => m._validation.matched)
    .map(m => ({ category: m._validation.category, name: m.name }));
  const interactions = checkInteractions(matchedMeds);

  // Compute overall confidence
  const confidences = deduplicated.map(m => m._validation.confidence);
  const avgConfidence = confidences.length > 0
    ? confidences.reduce((a, b) => a + b, 0) / confidences.length
    : 0;
  const lowConfidenceItems = deduplicated.filter(m => m._validation.confidence < 0.7 && m._validation.confidence > 0);

  return {
    date: extracted.date || new Date().toISOString().split("T")[0],
    hospitalName: extracted.hospitalName || "Unknown Hospital",
    doctorName: extracted.doctorName || "Unknown Doctor",
    summary: extracted.summary || null,
    medicines: deduplicated,
    _stats: {
      totalExtracted: extracted.medicines.length,
      validated: deduplicated.filter((m) => m._validation.matched).length,
      unmatched: deduplicated.filter((m) => !m._validation.matched).length,
      deduplicated: validatedMedicines.length - deduplicated.length,
      avgConfidence: Math.round(avgConfidence * 100),
      lowConfidenceCount: lowConfidenceItems.length,
      interactions,
    },
  };
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // @ts-ignore: Deno is available in Supabase Edge Functions
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert medical prescription OCR AI specialized in Indian prescriptions (handwritten & printed).

CRITICAL EXTRACTION RULES:
1. READ the image meticulously. Extract medicine names EXACTLY as printed/written — do NOT guess, invent, or substitute medicine names.
2. If a name is partially readable, output what you can see verbatim (e.g., "Melt 4mg" → output "Melt 4mg", NOT "Montelukast").
3. Include strength (mg, mcg, ml) and form (tablet, capsule, syrup) ONLY if clearly visible on the prescription.
4. For timing patterns:
   - "1-0-1" = Morning & Night
   - "1-1-1" = Morning, Afternoon & Night
   - "0-0-1" = Night only
   - "1-0-0" = Morning only
   - "BD" = Twice daily, "OD" = Once daily, "TDS" = Thrice daily, "QID" = 4 times daily
   - "SOS" = As needed, "STAT" = Immediately, "HS" = At bedtime
5. For food instructions:
   - "AC" or "A/C" = Before food (Ante Cibum)
   - "PC" or "P/C" = After food (Post Cibum)
   - If not specified, output "N/A"
6. Look for circled numbers or numbers in boxes which indicate duration in days.
7. Extract ALL medicine lines — do not skip any. Count items and verify you haven't missed any.
8. Do NOT include non-medicine text like diagnosis, advice, patient name, or instructions as medicines.
9. If the image is unclear or partially visible, still extract what is legible. Mark unclear parts.
10. For combination drugs (e.g., "Augmentin" = Amoxicillin+Clavulanate), use the brand name as written.

IMPORTANT: Only output what you can actually read. Zero hallucination tolerance.`;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: [
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${mimeType || "image/jpeg"};base64,${imageBase64}`,
                  },
                },
                {
                  type: "text",
                  text: "Extract ALL prescription details from this image. Read every medicine line carefully. Output exactly what is written — do not guess or substitute names. Count the medicines to ensure none are missed.",
                },
              ],
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "extract_prescription",
                description: "Extract structured prescription data from the image. Only include actual medicines, not diagnosis or advice text.",
                parameters: {
                  type: "object",
                  properties: {
                    is_valid_prescription: { type: "boolean", description: "Set to true ONLY if the uploaded image is actually a medical prescription containing medicines. If it is a picture of an animal, a food menu, a blank wall, or any unrelated document, set to false." },
                    date: { type: "string", description: "Prescription date in YYYY-MM-DD format. If unclear, use today's date." },
                    hospitalName: { type: "string", description: "Hospital or clinic name as printed on the header" },
                    doctorName: { type: "string", description: "Doctor name with qualifications (e.g., Dr. X, MBBS, MD)" },
                    summary: { type: "string", description: "Detailed clinical summary of the prescription. If a diagnosis is not visible, use the list of medicines to generate a helpful medical context and intended treatment. NEVER output 'Unavailable'." },
                    medicines: {
                      type: "array",
                      description: "List of ALL medicines on the prescription. Do not skip any.",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string", description: "Medicine name EXACTLY as written, including strength if visible (e.g., 'Dolo 650', 'Augmentin 625'). Do NOT correct or substitute." },
                          dosage: { type: "string", description: "Dosage pattern like '1-0-1', '1 tablet', or amount. Include duration if on same line." },
                          timing: { type: "string", description: "When to take: Morning/Afternoon/Night, BD, OD, TDS, SOS, etc." },
                          duration: { type: "string", description: "How long to take the medicine (e.g., '5 days', '1 month'). If not specified, output 'N/A'" },
                          food: { type: "string", description: "AC (before food), PC (after food), with food, or N/A if not specified" },
                        },
                        required: ["name", "dosage", "timing", "duration", "food"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["is_valid_prescription", "date", "hospitalName", "doctorName", "medicines", "summary"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "extract_prescription" },
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded. Please try again in a moment.",
            code: "RATE_LIMIT_EXCEEDED",
            retryable: true,
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error: "AI usage limit reached. Please add credits to your workspace.",
            code: "AI_CREDITS_EXHAUSTED",
            retryable: false,
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "AI processing failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const responseText = await response.text();
    console.log("AI response length:", responseText.length);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      console.error("Failed to parse AI response:", responseText.substring(0, 500));
      return new Response(
        JSON.stringify({ error: "AI returned invalid response. Please try again with a clearer image." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract from tool call or content fallback
    let extracted;
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (toolCall) {
      extracted = JSON.parse(toolCall.function.arguments);
    } else {
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          extracted = JSON.parse(jsonMatch[0]);
        }
      }
    }

    if (!extracted || !extracted.medicines) {
      return new Response(
        JSON.stringify({ error: "AI could not extract prescription data. Try a clearer image." }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── POST-PROCESSING PIPELINE ──
    const validated = postProcess(extracted);

    console.log("Validation stats:", JSON.stringify(validated._stats));
    console.log("Medicines:", validated.medicines.map(m =>
      `${m._validation.originalName} → ${m.name} [${m._validation.matchType}:${m._validation.confidence}]`
    ).join(" | "));
    if (validated._stats.interactions.length > 0) {
      console.log("⚠️ Drug interactions:", validated._stats.interactions.join("; "));
    }

    // Clean internal metadata before sending to client
    const clientResponse = {
      date: validated.date,
      hospitalName: validated.hospitalName,
      doctorName: validated.doctorName,
      summary: validated.summary,
      medicines: validated.medicines.map(({ _validation, ...rest }) => rest),
      confidence: validated._stats.avgConfidence,
      warnings: validated._stats.interactions,
    };

    return new Response(JSON.stringify(clientResponse), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-prescription error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
