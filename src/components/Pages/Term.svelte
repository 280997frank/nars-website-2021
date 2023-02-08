<script lang="ts">
  import { _ } from "svelte-i18n";

  import LegalPage from "@/components/Templates/LegalPage.svelte";
  import StarIcon from "@/components/Atoms/Icons/StarIcon.svelte";

  import { retailerName as retailerNameStore } from "@/stores/retailer";

  export let retailerName: string;

  $retailerNameStore = retailerName;
</script>

<LegalPage retailerName="{retailerName}" pageTitle="{$_('settings.tnc')}">
  <StarIcon slot="icon" />
  <div slot="content" class="term-condition">
    <p>
      本使用条款（以下简称“
      <strong>本条款</strong>
      ”）是您与资生堂旅游零售（亚太）私人有限公司（下文简称“
      <strong>资生堂</strong>
      ”或“
      <strong>我们</strong>
      ”）签署的使用条款。
      <strong>
        请您务必审慎阅读、充分理解各条款的内容，特别是免责声明、适用法律和争议解决条款。如果您通过微信小程序或其他渠道成功注册并参与
        <span class="helvetica-neue">NONSTOP NARS</span>
        活动（“
        <span class="helvetica-neue">NARS</span>
        活动”），即视为您已阅读、理解并接受本条款的约束。
      </strong>
    </p>
    <p>
      在阅读本条款的过程中，如果您不同意本条款或其中任何内容，您应立即停止注册。
      <strong
        >请注意，由于我们的服务主要面向十八周岁以上的成年人，如果您为不满十八周岁的未成年人，您目前无法创建自己的微信小程序账户。</strong
      >
    </p>

    <p>一、 注册账户</p>
    <ol class="pl-4-5">
      <li>
        您注册
        <span class="helvetica-neue">NARS</span>
        活动微信小程序账户或参与
        <span class="helvetica-neue">NARS</span>
        活动前，应当具备适用的法律所规定的与您行为相适应的民事行为能力。如您不符合上述的民事行为能力，则您应在您的监护人同意的情况下进行相应的操作，并应依照法律规定承担因此而导致的法律后果。
      </li>
      <li>
        请您按照注册页面提示填写或提供信息，阅读并同意本条款以及隐私政策后，您可成功注册账户，参与
        <span class="helvetica-neue"> NARS </span>
        活动。
      </li>
    </ol>

    <p>二、 <span class="helvetica-neue">NARS</span>活动规则</p>
    <p>
      为<span class="helvetica-neue">NARS</span>
      活动目的，您理解并同意接受以下规则：
    </p>
    <p>1. 试用品/赠品兑换</p>
    <ol class="pl-4-5 alphabet">
      <li>
        您须在<span class="helvetica-neue">NARS</span>
        活动促销期内前往换取地点并出示每个城市的解锁优惠券（通过
        <span class="helvetica-neue">NARS</span>
        活动微信小程序获取），以兑换试用品和/或赠品。
      </li>
      <li>
        每个人在每个城市仅限参与一次兑换。在
        <span class="helvetica-neue">NARS</span>
        活动促销期内根据先到先得、赠完即止的原则免费提供。
      </li>
      <li>
        我们没有也不会通过我们的
        <span class="helvetica-neue">NARS</span>
        活动微信小程序直接与已知未满18周岁的任何人员进行交易。如您未满18周岁，请勿注册或访问
        <span class="helvetica-neue">NARS</span>
        活动微信小程序，或以其他方式参与
        <span class="helvetica-neue">NARS</span>
        活动。参与
        <span class="helvetica-neue">NARS</span>
        活动，即表示您声明并确认您已年满18周岁。
      </li>
      <li>
        我们保留自行决定拒绝任何人兑换试用品/赠品的权利，且没有义务披露作出该等决定的理由。
      </li>
      <li>
        我们也保留在任何阶段、时间暂停或终止
        <span class="helvetica-neue"> NARS </span>
        活动的权利，恕不另行通知或对此承担责任。
      </li>
    </ol>
    <p>2. 试用品/赠品的库存</p>
    <ol class="pl-4-5 alphabet">
      <li>
        我们会尽合理努力保障试用品/赠品库存用于兑换，但
        <span class="helvetica-neue">NARS</span>
        活动微信小程序上显示的试用品和/或赠品不代表或保证整个促销期间的所有换取点均可兑换产品。
      </li>
      <li>
        一旦试用品和/或赠品库存兑换完毕或促销期结束（以较早者为准），
        <span class="helvetica-neue">NARS</span>
        活动将会停止。
      </li>
      <li>
        我们保留自行决定随时替换、撤回或变更用以兑换的试用品和/或赠品的权利，无论是否作出通知。
      </li>
    </ol>
    <p>3. 试用品/赠品的使用</p>
    <ol class="pl-4-5 alphabet">
      <li>我们提供的试用品和/或赠品仅供个人使用，不得用于转让、出售或转售。</li>
      <li>
        我们在此明确保留（无论是否作出通知）拒绝为那些我们认为有可能违反本条款的任何人兑换试用品和/或赠品的权利。
      </li>
    </ol>
    <p>4. 试用品/赠品的更换</p>
    <ol class="pl-4-5 alphabet">
      <li>
        所有试用品和/或赠品均经过检查，以确保在兑换前处于良好状态，一经兑换便不可更换。
      </li>
      <li>
        试用品和/或赠品不可转让或兑换成现金或其他物品（无论整体还是部分），如果丢失、损坏或失窃，亦不可更换。
      </li>
    </ol>

    <p>三、 知识产权声明</p>
    <ol class="pl-4-5">
      <li>
        除特别声明外，资生堂旅游零售（亚太）私人有限公司独立拥有
        <span class="helvetica-neue">NARS</span>
        活动微信小程序内所有内容（包括但不限于文字、图片、音频、视频资料以及页面设计、编排等）的知识产权。
      </li>
      <li>
        除非法律另有规定，未经我们书面同意，对于我们拥有知识产权的任何内容，任何人不得以任何方式进行使用。
      </li>
    </ol>

    <p>四、 商标权声明</p>
    <ol class="pl-4-5">
      <li>
        “
        <span class="helvetica-neue">NARS</span>
        ”等为资生堂申请或注册的商标，他人或者他方未经许可不得修改、复制或者以其它方式进行使用。
      </li>
      <li>
        任何试图淡化或丑化上述商标的行为都是违法的，我们保留追究其法律责任的权利
        。
      </li>
    </ol>

    <p>五、 转载声明</p>
    <ol class="pl-4-5">
      <li>
        除非法律另有规定，未经我们书面许可，任何人不得转载
        <span class="helvetica-neue">NARS</span>
        活动微信小程序内的任何内容。
      </li>
      <li>
        我们可能会引用、摘录或转载来自第三方的内容，但该部分内容仅供访问者交流或参考，其观点或信息与我们无关。
      </li>
    </ol>

    <p>六、 免责声明</p>
    <ol class="pl-4-5">
      <li>
        我们会采取必要的步骤和措施对
        <span class="helvetica-neue">NARS</span>
        活动场所和相关设备进行消毒，但我们不对您因参与
        <span class="helvetica-neue">NARS</span>
        活动或使用试用品/赠品而直接或间接导致的任何后果承担责任。
      </li>
      <li>
        我们会维护和更新
        <span class="helvetica-neue">NARS</span>
        活动微信小程序的内容，以向您提供活动的全面信息。基于互联网数据传输技术的复杂性，我们不能保证微信小程序所有信息的精确性。
      </li>
      <li>
        由于维护和更新或者其他技术原因导致您无法正常访问
        <span class="helvetica-neue">NARS</span>
        活动微信小程序并由此导致的后果，我们不承担责任。对于因不可抗力或我们不能控制的原因造成网络服务中断或其他缺陷，我们不承担任何责任。
      </li>
    </ol>

    <p>七、 第三方链接</p>
    <ol class="pl-4-5">
      <li>
        <span class="helvetica-neue">NARS</span>
        活动微信小程序可能含有指向第三方网站或第三方提供的微信小程序链接。请注意我们不会对每一个链接指向的网站或微信小程序进行审核，故我们不会对该网站或微信小程序的内容以及该网站或小程序给您造成的影响负责。同时，对于该链接指向的不由我们实际控制的任何网站或微信小程序上的内容，我们不承担任何责任。
      </li>
      <li>
        除我们已明确声明与该第三方存在合作关系，否则我们提供链接至该第三方网站或微信小程序的情况不构成我们对任何第三方或第三方提供的任何服务或产品的认可或推荐，也不构成我们与该第三方及其网站或微信小程序之间任何形式的合作。
      </li>
    </ol>

    <p>八、 修改</p>
    <ol class="pl-4-5">
      <li>
        我们保留对本条款的进行不时修改或修订的权利。如您对已生效的变更事项不同意的，您应当于变更事项确定的生效之日起停止使用
        <span class="helvetica-neue">NARS</span>
        活动微信小程序，变更事项对您不产生效力；如您在变更事项生效后仍继续使用
        <span class="helvetica-neue">NARS</span>
        活动微信小程序的，则视为您同意已生效的变更事项。
      </li>
      <li>
        如果我们认为您违反了我们的使用条款、隐私政策或者适用法律，或者实施危害资生堂合法权益等行为的，我们可以不作通知而直接限制、中止或终止您访问
        <span class="helvetica-neue">NARS</span>
        活动微信小程序和/或其服务，且不承担责任，并会保留相关记录，但不承诺按照令您满意的方式保存、留档您在相关微信小程序提交、保存的任何个人信息或内容。
      </li>
    </ol>

    <p>九、 赔偿</p>
    <p>
      对于您因使用
      <span class="helvetica-neue">NARS</span>
      活动微信小程序、您通过
      <span class="helvetica-neue">NARS</span>
      活动微信小程序发布或传送的任何内容或信息，或因您违反相关法律或本条款而以任何形式造成的索赔、责任和费用（包括合理的律师费），您同意就该等索赔的抗辩与我们合作，并就该等事项向我们做出赔偿。
    </p>

    <p>十、 不弃权</p>
    <p>
      我们未能行使或执行本条款的任何权利或条款，将不构成将其放弃。如果本条款的任何条款被有管辖权的法院确定为无效，本条款的其他条款应继续保持完全有效。
    </p>

    <p>十一、 适用法律与争议解决</p>
    <p>
      本条款的解释和应用受新加坡法律的管辖。与本条款有关的任何形式的争议应提交给有管辖权的新加披法院。
    </p>
  </div>
</LegalPage>

<style lang="scss">
  .term-condition {
    overflow-y: auto;
    flex: 1;
    // max-height: 90%;

    &::-webkit-scrollbar {
      display: none;
    }

    p {
      &:not(:last-child) {
        margin-bottom: 1.5rem;
      }

      &:last-child {
        margin-bottom: 5rem;
      }
    }

    ol {
      list-style-type: decimal;
      padding-left: revert;
      margin-bottom: 1.5rem;

      &.alphabet {
        list-style-type: lower-alpha;
      }

      &.pl-4-5 {
        padding-left: 1.3rem;
      }
    }
  }
</style>
