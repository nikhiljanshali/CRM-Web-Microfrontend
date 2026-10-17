export class InventoryExcelItems {

      // InvItems
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
      rap?: number
      discount?: number
      netAmount?: number
      perCarat?: number
      comments!: string
      status!: string
      //InvItem Measurement
      depth?: number
      table?: number
      length?: number
      width?: number
      height?: number
      crownHeight?: number
      crownAngle?: number
      pavilionDepth?: number
      pavilionAngle?: number
      girdlePer?: number
      minGirdle!: string
      maxGirdle!: string
      ratio?: number
      //StoneOrgDNorm
      empId!: string
      empName!: string
      orgId!: string
      orgName!: string
      deptId!: string
      deptName!: string
      branchName!: string
      country!: string
      city!: string
      // temp
      isDisabled?: boolean
      isPriceAvailable?: boolean

      //marketsheet Upload
      lab!: string
      certificateNo!: string
      flColor!: string
      ktoS!: string
      inscription!: string

      boxSerialNo!: string

      constructor() { }
}