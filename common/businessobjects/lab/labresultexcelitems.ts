export class LabResultExcelItems {
    
    type!: string
    stoneId!: string   
    kapan!: string   
    article!: string   
    shape!: string
    weight!: number
    color!: string
    clarity!: string
    cut!: string
    polish!: string
    symmetry!: string
    fluorescence!: string    
    strLn!: string
    lrHalf!: string
    rap!: number| null
    discount!: number| null
    netAmount!: number| null
    perCarat!: number| null
    certificateNo!: string
    Inscription!: string
    comments!: string
    status!: string 
    depth?: number
    table?: number
    length?: number
    width?: number
    crownHeight?: number
    crownAngle?: number
    pavilionDepth?: number
    pavilionAngle?: number
    girdlePer?: number
    minGirdle!: string
    maxGirdle!: string    
    girdleCondition!: string   
    culet!: string   
    ktoS!: string    
    flColor!: string    
    empId!: string
    empName!: string
    orgId!: string
    orgName!: string
    deptId!: string
    deptName!: string
    branchName!: string
    country!: string
    city!: string    
    isDisabled?: boolean
    isPriceAvailable?: boolean
    controlNo!: string    

    brown!: string;
    green!: string;
    milky!: string;
    shade!: string;
    sideBlack!: string;
    centerSideBlack!: string;
    centerBlack!: string;
    sideWhite!: string;
    centerSideWhite!: string;
    centerWhite!: string;
    openCrown!: string;
    openTable!: string;
    openPavilion!: string;
    openGirdle!: string;    
    efoc!: string;
    efot!: string;
    efog!: string;
    efop!: string;    
    hna!: string;
    eyeClean!: string;   
    naturalOnTable!: string;
    naturalOnGirdle!: string;
    naturalOnCrown!: string;
    naturalOnPavillion!: string;
    
    graining!: string;
    redSpot!: string;
    luster!: string;
    certiComment!: string;
    bowtie!: string;   
    height!: number   
    ratio!: number

    //Extra
    videoUrl!: string;   
    imageUrl!: string   
    certificateUrl!: string
    constructor() { }
}