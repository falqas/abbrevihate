function walk(node) {
  var child, next;

  var tagName = node.tagName ? node.tagName.toLowerCase() : '';
  if (tagName == 'input' || tagName == 'textarea') {
    return;
  }
  if (node.classList && node.classList.contains('ace_editor')) {
    return;
  }

  switch (node.nodeType) {
    case 1: // Element
    case 9: // Document
    case 11: // Document fragment
      child = node.firstChild;
      while (child) {
        next = child.nextSibling;
        walk(child);
        child = next;
      }
      break;

    case 3: // Text node
      handleText(node);
      break;
  }
}

function formatSpan(spanText, toolTipText) {
  var newSpan = document.createElement('span');
  newSpan.style.backgroundColor = 'rgba(0,133,242,.1)';
  newSpan.style.cursor = 'pointer';
  newSpan.title = toolTipText;
  newSpan.textContent = spanText;
  return newSpan;
}

function handleText(textNode) {
  const oldText = textNode.nodeValue;
  const newText = replaceText(textNode.nodeValue);
  if (newText !== oldText) {
    const newSpan = formatSpan(newText, oldText);
    textNode.replaceWith(newSpan);
  }
}

function replaceText(v) {
  const replacements = {
    '2WW': 'two week wait',
    AF: '<Aunt Flow? as f***?>',
    AFP: 'Alpha fetoprotein',
    'angel baby': 'baby lost before birth',
    'baby dance': 'insemination',
    'baby dust': 'good luck',
    BBT: 'basal body temperature',
    BCP: 'birth control pills',
    BD: 'insemination',
    BF: 'breastfeed',
    BFing: 'breastfeeding',
    BFP: 'positive pregnancy test',
    BFN: 'negative pregnancy test',
    BH: 'Braxton Hicks',
    BM: 'breast milk',
    BP: 'blood pressure',
    bubs: 'baby',
    bumpdate: 'pregnancy update',
    'bun in the oven': 'pregnant',
    CD: 'cycle day',
    CF: 'combo feeding',
    CIO: 'cry it out',
    CM: 'cervical mucus',
    CNM: 'Certified Nurse Midwife',
    CP: 'cervical position',
    CPM: 'Certified Professional Midwife',
    CS: 'cesarean section',
    'crimson week': 'period',
    'D&C': 'dilation and curettage',
    DD: 'my daughter',
    DF: 'dear fiance',
    DH: 'my husband',
    DP: 'dear partner',
    DS: 'my son',
    DW: 'my wife',
    DPO: 'days post ovulation',
    EBF: 'exclusively breastfeeding',
    EBFing: 'exclusively breastfeeding',
    EDD: 'estimated due date',
    EFF: 'exclusively formula feeding',
    embaby: 'embryo',
    embabies: 'embryos',
    EP: 'exclusively pumping',
    EPing: 'exclusively pumping',
    EWCM: 'egg white cervical mucus',
    FF: 'formula feeding',
    FMU: 'first morning urine',
    FTM: 'first time mom',
    GD: 'gestational diabetes',
    'girl dad': 'father of one or more girls',
    HB: 'heart beat',
    HBAC: 'home birth after cesarean',
    HG: 'Hyperemesis Gravidarum',
    HPT: 'home pregnancy test',
    hubby: 'my husband',
    hubs: 'my husband',
    hubster: 'my husband',
    IUI: 'intrauterine insemination',
    IVF: 'in vitro fertilization',
    'L&D': 'labor and delivery',
    'little miracle': 'baby',
    littles: 'children',
    LO: 'child',
    LOs: 'children',
    LMP: 'last menstrual period',
    MC: 'miscarriage',
    MF: 'male factor infertility',
    MFI: 'male factor infertility',
    ML: 'maternity leave',
    MOTN: 'middle of the night',
    MP: 'mucus plug',
    MS: 'morning sickness',
    'naptime hustle': "working during baby's nap",
    'nursing mom': 'breastfeeding mother',
    NT: 'nuchal translucency',
    NTNP: 'not trying, not preventing',
    OB: 'obstetrician',
    OPK: 'ovulation predictor kit',
    PL: 'paternity leave',
    PCOS: 'PolyCystic Ovary Syndrome',
    POAS: 'pee on a stick',
    PP: 'post partum',
    preggers: 'pregnant',
    preggo: 'pregnant',
    'pull the goalie': 'go off birth control',
    'pulled the goalie': 'going off birth control',
    'pulling the goalie': 'going off birth control',
    'rainbow baby': 'baby born after a loss',
    RE: 'reproductive endocrinologist',
    RLP: 'round ligament pain',
    SA: 'semen analysis',
    SAHD: 'stay at home dad',
    SAHDs: 'stay at home dads',
    SAHM: 'stay at home mom',
    SAHMs: 'stay at home moms',
    SAHP: 'stay at home parent',
    SAHPs: 'stay at home parents',
    SD: 'sperm donor',
    'shark week': 'period',
    'snow babies': 'frozen embryos',
    'snow baby': 'frozen embryo',
    STTN: 'sleeping through the night',
    TTC: 'trying to conceive',
    TWW: 'two week wait',
    VBAC: 'vaginal birth after cesarean',
    wifey: 'my wife',
  };

  for (let [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    v = v.replace(regex, function (match, offset, string) {
      // Check if it is the first word in a sentence
      const isFirstInSentence =
        offset === 0 || /[\.\!\?]\s*$/.test(string.slice(0, offset));

      if (isFirstInSentence) {
        return value.charAt(0).toUpperCase() + value.slice(1);
      } else {
        return value;
      }
    });
  }

  return v;
}

function isForbiddenNode(node) {
  return (
    node.isContentEditable ||
    (node.parentNode && node.parentNode.isContentEditable) ||
    (node.tagName &&
      (node.tagName.toLowerCase() == 'textarea' ||
        node.tagName.toLowerCase() == 'input'))
  );
}

function observerCallback(mutations) {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (isForbiddenNode(node)) {
        return;
      } else if (node.nodeType === 3) {
        handleText(node);
      } else {
        walk(node);
      }
    });
  });
}

function walkAndObserve(doc) {
  const docTitle = doc.getElementsByTagName('title')[0];
  const observerConfig = {
    characterData: true,
    childList: true,
    subtree: true,
  };

  walk(doc.body);
  doc.title = replaceText(doc.title);

  const bodyObserver = new MutationObserver(observerCallback);
  bodyObserver.observe(doc.body, observerConfig);

  if (docTitle) {
    const titleObserver = new MutationObserver(observerCallback);
    titleObserver.observe(docTitle, observerConfig);
  }
}
if (document.readyState !== 'loading') {
  const watchedDomains = [
    'babycenter.com',
    'babygaga.com',
    'birthwithoutfearblog.com',
    'cafemom.com',
    'community.whattoexpect.com',
    'fitpregnancy.com',
    'kellymom.com',
    'mamanatural.com',
    'mom365.com',
    'mothering.com',
    'naturalparenting.com.au',
    'old.reddit.com',
    'parents.com',
    'pregnancy.org',
    'pregnancyinfo.ca',
    'reddit.com',
    'scarymommy.com',
    'thebump.com',
    'thefussybabysite.com',
    'todaysparent.com',
  ];

  const redditPaths = [
    '/r/BB30',
    '/r/BeyondTheBump',
    '/r/CautiousBB',
    '/r/daddit',
    '/r/ectopicsupportgroup',
    '/r/fitpregnancy',
    '/r/Miscarriage',
    '/r/Mommit',
    '/r/Newparents',
    '/r/Parenting',
    '/r/PregnancyAfterLoss',
    '/r/predaddit',
    '/r/specialneedsbabies',
    '/r/TFABGrads',
    '/r/TFABLinePorn',
    '/r/Toddlers',
    '/r/ttcafterloss',
    '/r/TTC30',
    '/r/TryingForABaby',
    '/r/TryingForAnother',
    '/r/tfmr_support',
    '/r/VBAC',
    '/r/waiting_to_try',
  ];

  const currentDomain = window.location.hostname;
  const currentPath = window.location.pathname;
  const isReddit = currentDomain.includes('reddit');

  if (
    watchedDomains.some((domain) => currentDomain.includes(domain)) ||
    (isReddit && redditPaths.includes(currentPath))
  ) {
    walkAndObserve(document);
  } else {
  }
}
